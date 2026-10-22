/**
 * Яндекс Метрика. Счётчик подключается, только если задана переменная
 * окружения NEXT_PUBLIC_YM_ID (номер счётчика). NEXT_PUBLIC_* попадает в
 * сборку на этапе build, поэтому для Docker её нужно передать как build-arg.
 *
 * Основной код счётчика — inline-скрипт в app/(site)/layout.tsx; запасной
 * запуск для 404 — MetrikaNotFoundInit. Номер счётчика, адрес tag.js и
 * параметры init общие для обоих мест.
 */
const rawId = process.env.NEXT_PUBLIC_YM_ID?.trim();

/** Номер счётчика или null, если Метрика не подключена. */
export const METRIKA_ID: number | null = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;

export const METRIKA_TAG_URL =
  METRIKA_ID === null ? null : `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;

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
const METRIKA_INIT_OPTIONS_JS = Object.entries(METRIKA_INIT_OPTIONS)
  .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
  .join(", ");

/** Код счётчика из кабинета Метрики; null, если счётчик не задан. */
export const METRIKA_SCRIPT =
  METRIKA_ID === null
    ? null
    : `
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','${METRIKA_TAG_URL}', 'ym');

    ym(${METRIKA_ID}, 'init', {${METRIKA_INIT_OPTIONS_JS}, referrer: document.referrer, url: location.href});
`;

/** Цели Метрики, которые отправляет сайт. */
export type MetrikaGoal = "form_submit" | "phone_click" | "telegram_click" | "portfolio_cta";

type Ym = ((counterId: number, method: string, ...args: unknown[]) => void) & {
  a?: IArguments[];
  l?: number;
};

declare global {
  interface Window {
    ym?: Ym;
  }
}

export function reachGoal(goal: MetrikaGoal) {
  if (METRIKA_ID === null) return;
  window.ym?.(METRIKA_ID, "reachGoal", goal);
}
