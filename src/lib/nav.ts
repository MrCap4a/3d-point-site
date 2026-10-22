import { SERVICES } from "@/content/services";

export const BRAND = {
  en: "3Dpoint",
  ru: "3Дточка",
} as const;

export type NavLink = {
  href: string;
  label: string;
};

/** Основные разделы (в шапке «Услуги» стоит между «Бизнесу» и «Портфолио»). */
export const NAV_LINKS: NavLink[] = [
  { href: "/private", label: "Частным лицам" },
  { href: "/business", label: "Бизнесу" },
  { href: "/portfolio", label: "Портфолио" },
];

export const SERVICE_LINKS: NavLink[] = SERVICES.map((service) => ({
  href: `/${service.slug}`,
  label: service.navLabel,
}));

export const LEGAL_LINKS: NavLink[] = [
  { href: "/privacy", label: "Политика обработки персональных данных" },
  { href: "/consent", label: "Согласие на обработку персональных данных" },
];

export type PrimaryCta = {
  label: string;
  href: string;
};

/** Страницы, на которых есть своя форма заявки (#request-form). */
const PAGES_WITH_FORM = new Set([
  "/",
  "/private",
  "/business",
  "/portfolio",
  ...SERVICE_LINKS.map((link) => link.href),
]);

/**
 * Основной CTA сайта — «Оставить заявку». Ведёт к форме на текущей
 * странице, а там, где формы нет (правовые страницы, 404), — к форме на
 * главной.
 */
export function getPrimaryCta(pathname: string): PrimaryCta {
  const page = PAGES_WITH_FORM.has(pathname) ? pathname : "/";
  return { label: "Оставить заявку", href: `${page}#request-form` };
}
