import { prisma } from "@/lib/prisma";

export type ContactLink = { label: string; href: string };

export type SiteContacts = {
  phone: ContactLink | null;
  telegram: ContactLink | null;
};

/**
 * Телефон в href="tel:..." — только цифры и ведущий "+". Российские номера,
 * введённые как "8 903 ..." или "7 903 ...", приводятся к "+7...".
 */
export function phoneHref(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7"))) {
    return `tel:+7${digits.slice(1)}`;
  }
  return `tel:+${digits}`;
}

/**
 * Ник Telegram из того, что ввёл администратор: "@nick", "nick",
 * "t.me/nick" или "https://t.me/nick" — всё сводится к "nick".
 */
export function telegramUsername(raw: string): string | null {
  const username = raw
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
  return username || null;
}

/**
 * Контакты для публичной части сайта из настроек админки. Пустое поле —
 * null, и соответствующий блок на сайте не выводится.
 */
export async function getSiteContacts(): Promise<SiteContacts> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ["phone", "telegram"] } },
  });
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value.trim()]));

  const phone = values.phone ? phoneHref(values.phone) : null;
  const telegram = values.telegram ? telegramUsername(values.telegram) : null;

  return {
    phone: phone ? { label: values.phone, href: phone } : null,
    telegram: telegram ? { label: `@${telegram}`, href: `https://t.me/${telegram}` } : null,
  };
}
