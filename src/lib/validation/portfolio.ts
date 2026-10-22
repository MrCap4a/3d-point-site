import { z } from "zod";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio";

/**
 * Валидация кейса портфолио для админки. Оформление в духе объявлений:
 * название, фото, описание и необязательные цена, материал, срок,
 * категории и фото «до».
 */
export const portfolioCaseSchema = z.object({
  title: z.string().trim().min(1, "Укажите название кейса").max(200),
  description: z.string().trim().min(1, "Добавьте описание").max(2000),
  // Цена — свободный текст (например "2500 ₽" или "от 1500 ₽"), необязательна.
  price: z.string().trim().max(100).optional().or(z.literal("")),
  material: z.string().trim().max(100).optional().or(z.literal("")),
  leadTime: z.string().trim().max(100).optional().or(z.literal("")),
  categories: z.array(z.enum(PORTFOLIO_CATEGORIES)).default([]),
  // id одного из изображений кейса или пусто, если фото «до» нет.
  beforeImageId: z.string().trim().max(100).optional().or(z.literal("")),
});

export type PortfolioCaseInput = z.infer<typeof portfolioCaseSchema>;
