import { telegramRequest } from '../src/lib/telegram-transport.mjs';

// Read-only Bot API check: never sends notifications or prints account data.
try {
  for (const [method, payload] of [['getMe', {}], ['getChat', { chat_id: process.env.TELEGRAM_CHAT_ID }]]) {
    const result = await telegramRequest(method, process.env.TELEGRAM_BOT_TOKEN || '', payload);
    console.log(`${method}: ${result.ok ? 'OK' : 'FAILED'} (HTTP ${result.status})`);
    if (!result.ok) process.exitCode = 1;
  }
} catch {
  console.error('Telegram connection failed; credentials and responses omitted');
  process.exitCode = 1;
}
