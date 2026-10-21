/**
 * Яндекс Метрика. Основной код счётчика — inline-скрипт в
 * app/(site)/layout.tsx; запасной запуск для 404 — MetrikaNotFoundInit.
 * Номер счётчика, адрес tag.js и параметры init общие для обоих мест.
 */
export const METRIKA_ID = 109128994;

export const METRIKA_TAG_URL = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;

/**
 * Статические параметры init. referrer и url вычисляются в браузере в
 * момент запуска (document.referrer, location.href) и добавляются к ним
 * в каждом месте инициализации.
 */
export const METRIKA_INIT_OPTIONS = {
  ssr: true,
  webvisor: true,
  clickmap: true,
  ecommerce: "dataLayer",
  accurateTrackBounce: true,
  trackLinks: true,
} as const;

/** METRIKA_INIT_OPTIONS как JS-литерал без фигурных скобок — для inline-скрипта. */
export const METRIKA_INIT_OPTIONS_JS = Object.entries(METRIKA_INIT_OPTIONS)
  .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
  .join(", ");

type Ym = ((counterId: number, method: string, ...args: unknown[]) => void) & {
  a?: IArguments[];
  l?: number;
};

declare global {
  interface Window {
    ym?: Ym;
  }
}

export function reachGoal(goal: string) {
  window.ym?.(METRIKA_ID, "reachGoal", goal);
}
