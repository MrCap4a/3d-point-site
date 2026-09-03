import type { Lead } from "@prisma/client";

/**
 * Уведомление администратора о новой заявке через Telegram-бота.
 *
 * Отправка намеренно «мягкая»: любая ошибка (нет токена, Telegram недоступен,
 * бот заблокирован) логируется, но не пробрасывается наверх — заявка уже
 * сохранена в БД и её всегда можно посмотреть в админке. Telegram здесь лишь
 * канал оперативного оповещения, а не источник правды.
 */

const CATEGORY_LABELS: Record<Lead["category"], string> = {
  PRIVATE: "Частный клиент",
  BUSINESS: "Бизнес",
  SERIAL: "Серийное производство",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildMessage(lead: Lead, fileCount: number): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const lines: string[] = [
    "🔔 <b>Новая заявка с сайта</b>",
    "",
    `<b>Категория:</b> ${escapeHtml(CATEGORY_LABELS[lead.category] ?? lead.category)}`,
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contactValue)} (${escapeHtml(lead.contactMethod)})`,
  ];

  if (lead.company) lines.push(`<b>Компания:</b> ${escapeHtml(lead.company)}`);
  if (lead.batchSize) lines.push(`<b>Объём партии:</b> ${escapeHtml(lead.batchSize)}`);

  lines.push("", `<b>Задача:</b>`, escapeHtml(lead.description));

  if (fileCount > 0) lines.push("", `📎 Приложено файлов: ${fileCount}`);
  if (lead.sourcePage) lines.push("", `<b>Страница:</b> ${escapeHtml(lead.sourcePage)}`);
  if (siteUrl) lines.push("", `${siteUrl}/admin/leads/${lead.id}`);

  return lines.join("\n");
}

export async function notifyNewLead(lead: Lead, fileCount = 0): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "Telegram-уведомление пропущено: не заданы TELEGRAM_BOT_TOKEN и/или TELEGRAM_CHAT_ID"
    );
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessage(lead, fileCount),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        // Не даём медленному Telegram задерживать ответ пользователю.
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      console.error(
        `Telegram sendMessage вернул ${response.status}: ${details.slice(0, 500)}`
      );
    }
  } catch (error) {
    console.error("Не удалось отправить Telegram-уведомление о заявке", error);
  }
}
