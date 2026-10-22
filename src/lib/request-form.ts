/**
 * Связь «Нужно похожее» в модалке портфолио с формой заявки на той же
 * странице: модалка шлёт событие с текстом, форма подставляет его в поле
 * «Что случилось» и получает фокус.
 */
export const REQUEST_FORM_ID = "request-form";
export const PREFILL_EVENT = "request-form:prefill";

export type PrefillDetail = { text: string };

export function prefillRequestForm(text: string) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: { text } }));
  document.getElementById(REQUEST_FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
