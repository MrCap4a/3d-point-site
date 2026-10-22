/**
 * Конфиг контента сайта — единственное место, где задаются цифры, цены,
 * сроки, отзывы и фото, которые нельзя выдумывать.
 *
 * Правило: значение null (или пустой массив) означает «владелец ещё не
 * подтвердил» — блок, который от него зависит, НЕ рендерится. Никаких
 * «[цена]» и «Lorem» на сайте быть не должно.
 *
 * Все поля с пометкой TODO заполняет владелец.
 */

/** Изображение из /public: путь от корня сайта и описание для alt. */
export type SiteImage = { src: string; alt: string };

export type PriceItem = { label: string; from: number };

export type ReviewSource = "avito" | "yandex_maps" | "direct";

export type Review = {
  author: string;
  source: ReviewSource;
  text: string;
  /** Дата в формате YYYY-MM-DD. */
  date: string;
};

/**
 * TODO: за сколько часов отвечаете на заявку, например 2.
 * Появится в hero («Отвечаем в течение N ч»), под кнопкой формы и в
 * сообщении об успешной отправке.
 */
export const RESPONSE_HOURS: number | null = null;

/**
 * TODO: фото «было → стало» для hero, например
 * { src: "/hero/before-after.jpg", alt: "Сломанная деталь и новая, напечатанная на замену" }.
 * Файл положить в public/hero/. Пока null — в hero коллаж из трёх первых
 * фото портфолио.
 */
export const HERO_IMAGE: SiteImage | null = null;

/**
 * TODO: цены «от», например { label: "Простая деталь по образцу", from: 1500 }.
 * Пока массив пуст — блок «Сколько стоит» на главной скрыт.
 */
export const PRICES: PriceItem[] = [];

/**
 * TODO: реальные отзывы (с Авито, Яндекс Карт или присланные напрямую).
 * Не придумывать. Пока массив пуст — блок «Отзывы» скрыт.
 */
export const REVIEWS: Review[] = [];

/**
 * TODO: 2–4 фото оборудования и процесса (без владельца), файлы — в
 * public/workshop/. Пока массив пуст — фото-сетка в блоке «Мастерская» скрыта.
 */
export const WORKSHOP_IMAGES: SiteImage[] = [];

/**
 * TODO: диапазон малой серии, шт. Если SERIAL_MAX = null, на /business
 * выводится фраза без диапазона.
 */
export const SERIAL_MIN: number | null = null;
export const SERIAL_MAX: number | null = null;

/**
 * TODO: условия для юрлиц — пункты списка, например «Безналичный расчёт».
 * Пока null — секция «Работа с юрлицами» на /business скрыта.
 */
export const B2B_TERMS: string[] | null = null;

/**
 * TODO: email для обращений по персональным данным. Пока null — на
 * /privacy и /consent вместо email выводится телефон.
 */
export const LEGAL_EMAIL: string | null = null;

/**
 * TODO: срок хранения персональных данных из заявок, например «3 года с
 * момента получения заявки». Пока null — в политике указан срок по
 * умолчанию из 152-ФЗ: до достижения целей обработки или отзыва согласия.
 */
export const RETENTION: string | null = null;

export const REVIEW_SOURCE_LABELS: Record<ReviewSource, string> = {
  avito: "Авито",
  yandex_maps: "Яндекс Карты",
  direct: "Прямой отзыв",
};

/** «Отвечаем в течение N ч» или null, если срок не задан. */
export function responseTimeText(): string | null {
  return RESPONSE_HOURS === null ? null : `Отвечаем в течение ${RESPONSE_HOURS} ч`;
}
