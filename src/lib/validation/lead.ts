import { z } from "zod";

/**
 * Серверная валидация заявки. Форма — не полноценное ТЗ, поэтому набор
 * обязательных полей минимален: имя, способ связи, краткое описание и
 * согласие на обработку персональных данных. Остальное (компания, файлы,
 * страница-источник) — опционально.
 *
 * В форме два типа клиента: частное лицо и бизнес. SERIAL остаётся в БД
 * только для старых заявок — серийное производство теперь часть /business.
 */
export const leadCategorySchema = z.enum(["PRIVATE", "BUSINESS"]);
export const contactMethodValues = ["telegram", "phone", "email", "other"] as const;

export const leadFormSchema = z.object({
  category: leadCategorySchema,
  name: z.string().trim().min(1, "Укажите имя").max(120),
  contactValue: z.string().trim().min(2, "Укажите, как с вами связаться").max(200),
  description: z.string().trim().min(1, "Опишите, что случилось").max(4000),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  // Название страницы услуги, с которой отправлена заявка (скрытое поле).
  source: z.string().trim().max(120).optional().or(z.literal("")),
  consent: z.literal("on", {
    error: "Отметьте согласие на обработку персональных данных",
  }),
  // Honeypot-поле: обычный пользователь его не видит и не заполняет.
  website: z.string().max(0, "Заявка отклонена").optional().or(z.literal("")),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

export const MAX_FILE_SIZE_MB = 15;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_FILES_PER_LEAD = 5;

/** То же, что accept у поля файлов в форме. */
export const FILE_INPUT_ACCEPT = "image/*,.pdf,.stl,.step,.stp,.obj";

/** Расширения не-изображений, которые принимаем (модели и PDF). */
const ALLOWED_EXTENSIONS = new Set([".pdf", ".stl", ".step", ".stp", ".obj"]);

/**
 * Файл подходит, если это изображение или PDF/3D-модель по расширению.
 * MIME у моделей браузеры определяют непредсказуемо (часто пустой или
 * application/octet-stream), поэтому для них решает расширение.
 */
export function isAllowedLeadFile(file: { name: string; type: string }): boolean {
  if (file.type.startsWith("image/")) return true;
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
  return ALLOWED_EXTENSIONS.has(ext);
}
