import { prisma } from "@/lib/prisma";
import { COMPANY } from "@/lib/company";

export type ContactLink = { label: string; href: string };

export type SiteContacts = {
  phone: ContactLink | null;
  telegram: ContactLink | null;
  /**
   * Ссылка на чат в MAX из настроек админки. У MAX нет публичной ссылки на
   * чат по номеру телефона (как wa.me), поэтому без ссылки рядом с
   * телефоном просто пишем, что номер есть в MAX.
   */
  max: ContactLink | null;
};

/** Принимаем только ссылки на max.ru — чтобы в шапку не попал чужой адрес. */
export function maxHref(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (host !== "max.ru" && !host.endsWith(".max.ru"))) return null;
    return url.toString();
  } catch {
    return null;
  }
}

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
 * Контакты для публичной части сайта. Приоритет — настройки админки; если
 * поле там пустое, берётся подтверждённое значение из @/lib/company. Если
 * пусто и там — null, и соответствующий блок на сайте не выводится.
 */
export async function getSiteContacts(): Promise<SiteContacts> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ["phone", "telegram", "max"] } },
  });
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value.trim()]));
  const values = {
    phone: settings.phone || COMPANY.phone.display,
    telegram: settings.telegram || COMPANY.telegram.handle,
  };

  const phone = values.phone ? phoneHref(values.phone) : null;
  const telegram = values.telegram ? telegramUsername(values.telegram) : null;
  const max = settings.max ? maxHref(settings.max) : null;

  return {
    phone: phone ? { label: values.phone, href: phone } : null,
    telegram: telegram ? { label: `@${telegram}`, href: `https://t.me/${telegram}` } : null,
    max: max ? { label: "MAX", href: max } : null,
  };
}
