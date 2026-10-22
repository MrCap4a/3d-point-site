import { prisma } from "@/lib/prisma";
import {
  toPortfolioCaseData,
  type PortfolioCaseData,
  type PortfolioCategory,
} from "@/lib/portfolio";

/**
 * Опубликованные кейсы портфолио в порядке из админки. С категорией —
 * только кейсы, отмеченные этой категорией.
 */
export async function getPublishedCases(options: {
  category?: PortfolioCategory;
  take?: number;
} = {}): Promise<PortfolioCaseData[]> {
  const rows = await prisma.portfolioCase.findMany({
    where: {
      isPublished: true,
      // Категории хранятся строкой "a,b,c"; ищем точное вхождение элемента.
      ...(options.category
        ? {
            OR: [
              { categories: options.category },
              { categories: { startsWith: `${options.category},` } },
              { categories: { endsWith: `,${options.category}` } },
              { categories: { contains: `,${options.category},` } },
            ],
          }
        : {}),
    },
    orderBy: { sortOrder: "asc" },
    take: options.take,
    include: { images: { orderBy: { sortOrder: "asc" }, select: { id: true } } },
  });

  return rows.map(toPortfolioCaseData);
}
