import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import tls from 'node:tls';
import ssh2 from 'ssh2';
import { sshConfig, telegramRequest } from '../src/lib/telegram-transport.mjs';

const keys = ssh2.utils.generateKeyPairSync('ed25519');
const raw = Buffer.from(keys.public.split(' ')[1], 'base64');
const fingerprint = 'SHA256:' + createHash('sha256').update(raw).digest('base64').replace(/=+$/, '');
const base = { TELEGRAM_TRANSPORT: 'ssh', TELEGRAM_SSH_HOST: '127.0.0.1', TELEGRAM_SSH_USER: 'test',
  TELEGRAM_SSH_PRIVATE_KEY_B64: Buffer.from(keys.private).toString('base64'), TELEGRAM_SSH_HOST_KEY_SHA256: fingerprint };

test('requires complete SSH settings and rejects changed server identity', () => {
  assert.throws(() => sshConfig({}), /TELEGRAM_SSH_CONFIG/);
  assert.equal(sshConfig(base).hostVerifier(raw), true);
  assert.equal(sshConfig(base).hostVerifier(Buffer.from('different server')), false);
});

test('invalid mode and method fail before connecting without leaking credentials', async () => {
  await assert.rejects(telegramRequest('getMe', '123:secret', {}, { TELEGRAM_TRANSPORT: 'typo' }), /^Error: TELEGRAM_TRANSPORT_CONFIG$/);
  await assert.rejects(telegramRequest('getUpdates', '123:secret', {}, base), /TELEGRAM_REQUEST_CONFIG/);
});

test('real SSH forwarding: fixed destination, TLS validation, safe result, cleanup', async t => {
  const clients = new Set();
  let forwarded;
  const server = new ssh2.Server({ hostKeys: [keys.private] }, client => {
    clients.add(client);
    client.on('error', () => {});
    client.on('close', () => clients.delete(client));
    client.on('authentication', ctx => ctx.accept());
    client.on('tcpip', (accept, reject, info) => {
      forwarded = info;
      const channel = accept();
      channel.once('data', () => channel.end('HTTP/1.1 200 OK\r\nContent-Length: 11\r\nConnection: close\r\n\r\n{"ok":true}'));
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { for (const client of clients) client.end(); server.close(); });
  // Replace only TLS wrapping: SSH transport and HTTP parsing remain real.
  t.mock.method(tls, 'connect', options => {
    assert.equal(options.rejectUnauthorized, true);
    assert.equal(options.servername, 'api.telegram.org');
    const stream = options.socket;
    stream.setKeepAlive = stream.setNoDelay = stream.setTimeout = () => stream;
    return stream;
  });
  const env = { ...base, TELEGRAM_SSH_PORT: String(server.address().port) };
  const result = await telegramRequest('getMe', '123:secret', {}, env);
  assert.deepEqual(result, { status: 200, ok: true });
  assert.equal(forwarded.destIP, 'api.telegram.org');
  assert.equal(forwarded.destPort, 443);
  await assert.rejects(telegramRequest('getMe', '123:secret', {}, {
    ...env, TELEGRAM_SSH_HOST_KEY_SHA256: 'SHA256:' + 'A'.repeat(43),
  }), /^Error: TELEGRAM_CONNECTION$/);
});

test('stalled SSH forwarding times out and closes the client', async t => {
  let connection;
  const server = new ssh2.Server({ hostKeys: [keys.private] }, client => {
    connection = client;
    client.on('error', () => {});
    client.on('authentication', ctx => ctx.accept());
    client.on('tcpip', () => {}); // Deliberately never accept or reject.
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { connection?.end(); server.close(); });
  await assert.rejects(telegramRequest('getMe', '123:secret', {}, {
    ...base, TELEGRAM_SSH_PORT: String(server.address().port),
  }), /^Error: TELEGRAM_TIMEOUT$/);
});
