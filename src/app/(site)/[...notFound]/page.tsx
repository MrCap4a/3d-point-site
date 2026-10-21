import { notFound } from "next/navigation";

/**
 * Перехватывает любые несовпавшие адреса публичной части и показывает
 * (site)/not-found.tsx — внутри публичного layout, с шапкой, футером и
 * Метрикой. Общего root layout у приложения нет (у админки свой), поэтому
 * без этого маршрута Next отдал бы голую встроенную 404. Конкретные
 * маршруты (/admin, /api/*, страницы сайта) имеют приоритет над catch-all.
 */
export default function CatchAllNotFound() {
  notFound();
}
