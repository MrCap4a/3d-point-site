import https from 'node:https';
import { createHash } from 'node:crypto';
import tls from 'node:tls';
import ssh2 from 'ssh2';

// Never include URLs, payloads or underlying errors in diagnostic messages.
export function sshConfig(env) {
  const host = env.TELEGRAM_SSH_HOST;
  const username = env.TELEGRAM_SSH_USER;
  const fingerprint = env.TELEGRAM_SSH_HOST_KEY_SHA256;
  const encoded = env.TELEGRAM_SSH_PRIVATE_KEY_B64;
  const port = Number(env.TELEGRAM_SSH_PORT || 22);
  if (!host || !username || !/^SHA256:[A-Za-z0-9+/]{43}$/.test(fingerprint || '') ||
      !encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) ||
      !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('TELEGRAM_SSH_CONFIG');
  }
  return {
    host, port, username, privateKey: Buffer.from(encoded, 'base64'),
    readyTimeout: 8000,
    hostVerifier: key => 'SHA256:' + createHash('sha256').update(key).digest('base64').replace(/=+$/, '') === fingerprint,
  };
}

/** Fixed Telegram destination; SSH mode never falls back to a direct request. */
export async function telegramRequest(method, token, payload, env = process.env) {
  if (!['sendMessage', 'getMe', 'getChat'].includes(method) || !/^[0-9]+:[A-Za-z0-9_-]+$/.test(token)) {
    throw new Error('TELEGRAM_REQUEST_CONFIG');
  }
  const mode = env.TELEGRAM_TRANSPORT || 'direct';
  if (!['direct', 'ssh'].includes(mode)) throw new Error('TELEGRAM_TRANSPORT_CONFIG');
  const body = JSON.stringify(payload);
  // One agent per request: no persistent SSH connection or public proxy listener.
  const config = mode === 'ssh' ? sshConfig(env) : undefined;
  const client = config ? new ssh2.Client() : undefined;
  const agent = client ? new https.Agent({ keepAlive: false }) : undefined;
  if (agent) {
    agent.createConnection = (options, callback) => {
      client.once('error', callback);
      client.once('ready', () => {
        client.forwardOut('127.0.0.1', 0, 'api.telegram.org', 443, (error, channel) => {
          if (error) return callback(error);
          callback(null, tls.connect({ socket: channel, servername: 'api.telegram.org', rejectUnauthorized: true }));
        });
      });
      client.connect(config);
    };
  }
  try {
    return await new Promise((resolve, reject) => {
      let request;
      const timer = setTimeout(() => {
        request?.destroy();
        reject(new Error('TELEGRAM_TIMEOUT'));
      }, 10000);
      const fail = () => {
        clearTimeout(timer);
        reject(new Error('TELEGRAM_CONNECTION'));
      };
      try {
        request = https.request({
          hostname: 'api.telegram.org', port: 443, servername: 'api.telegram.org',
          rejectUnauthorized: true, method: 'POST', agent,
          path: `/bot${token}/${method}`,
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), Connection: 'close' },
        }, response => {
          let text = '';
          response.on('error', fail);
          response.on('aborted', fail);
          response.on('data', chunk => {
            text += chunk;
            if (text.length > 65536) request.destroy();
          });
          response.on('end', () => {
            clearTimeout(timer);
            try {
              const data = JSON.parse(text);
              resolve({ status: response.statusCode, ok: response.statusCode === 200 && data.ok === true });
            } catch { fail(); }
          });
        });
        request.on('error', fail);
        request.end(body);
      } catch { fail(); }
    });
  } finally {
    agent?.destroy();
    client?.destroy();
  }
}
