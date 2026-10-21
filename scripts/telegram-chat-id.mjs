/**
 * Помощник для настройки Telegram-уведомлений о заявках.
 *
 * Что делает:
 *   1. По токену бота запрашивает у Telegram последние обновления (getUpdates);
 *   2. печатает все chat id, из которых боту писали, — это и есть значение
 *      для TELEGRAM_CHAT_ID;
 *   3. при флаге --send отправляет тестовое сообщение в TELEGRAM_CHAT_ID,
 *      чтобы убедиться, что связка «токен + chat id» рабочая.
 *
 * Использование (из корня проекта):
 *   node scripts/telegram-chat-id.mjs            — показать доступные chat id
 *   node scripts/telegram-chat-id.mjs --send     — отправить тестовое сообщение
 *
 * Токен и chat id берутся из переменных окружения TELEGRAM_BOT_TOKEN /
 * TELEGRAM_CHAT_ID. Если у вас есть .env — подгрузите его, например:
 *   node --env-file=.env scripts/telegram-chat-id.mjs
 * (Node.js 20.6+ поддерживает --env-file; на более старых версиях просто
 *  задайте переменные окружения вручную.)
 *
 * Перед запуском не забудьте написать боту любое сообщение в Telegram —
 * иначе getUpdates ничего не вернёт.
 */

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const shouldSend = process.argv.includes("--send");

if (!token) {
  console.error("Не задан TELEGRAM_BOT_TOKEN. Пример запуска:");
  console.error("  node --env-file=.env scripts/telegram-chat-id.mjs");
  process.exit(1);
}

const api = (method) => `https://api.telegram.org/bot${token}/${method}`;

async function call(method, body) {
  const res = await fetch(api(method), {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`${method}: ${data.error_code} ${data.description}`);
  }
  return data.result;
}

const me = await call("getMe");
console.log(`Бот: @${me.username} (${me.first_name})\n`);

if (shouldSend) {
  if (!chatId) {
    console.error("Для --send нужен TELEGRAM_CHAT_ID.");
    process.exit(1);
  }
  await call("sendMessage", {
    chat_id: chatId,
    text: "✅ Тестовое сообщение: уведомления о заявках 3Dpoint настроены.",
  });
  console.log(`Тестовое сообщение отправлено в chat id ${chatId}.`);
  process.exit(0);
}

const updates = await call("getUpdates");
const chats = new Map();
for (const u of updates) {
  const msg = u.message ?? u.channel_post ?? u.my_chat_member;
  const chat = msg?.chat;
  if (chat) chats.set(chat.id, chat);
}

if (chats.size === 0) {
  console.log(
    "Обновлений нет. Напишите боту любое сообщение в Telegram (или добавьте\n" +
      "его в группу/канал) и запустите скрипт снова.\n\n" +
      "Если бот уже подключён к вебхуку, getUpdates всегда пуст — тогда chat id\n" +
      "проще взять вручную из https://api.telegram.org/bot<ТОКЕН>/getUpdates"
  );
  process.exit(0);
}

console.log("Найденные chat id (подставьте нужный в TELEGRAM_CHAT_ID):\n");
for (const chat of chats.values()) {
  const title =
    chat.title ??
    [chat.first_name, chat.last_name].filter(Boolean).join(" ") ??
    chat.username ??
    "";
  console.log(`  ${chat.id}\t${chat.type}\t${title}`);
}
