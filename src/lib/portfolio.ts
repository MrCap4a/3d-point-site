export const PORTFOLIO_CATEGORIES = [
  "private",
  "business",
  "scanning",
  "agro",
  "auto",
  "signs",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  private: "Частные",
  business: "Бизнес",
  scanning: "3D-сканирование",
  agro: "Сельхозтехника",
  auto: "Авто",
  signs: "Таблички",
};

export type PortfolioCaseData = {
  id: string;
  title: string;
  description: string;
  price: string | null;
  material: string | null;
  leadTime: string | null;
  categories: PortfolioCategory[];
  /** Фото «после» и прочие — без фото «до». Первое — обложка. */
  images: { id: string }[];
  /** Фото «до», если отмечено в админке. */
  beforeImage: { id: string } | null;
};

/** Категории хранятся в БД строкой через запятую (SQLite не умеет списки). */
export function parseCategories(value: string): PortfolioCategory[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is PortfolioCategory =>
      (PORTFOLIO_CATEGORIES as readonly string[]).includes(item)
    );
}

export function serializeCategories(values: string[]): string {
  return PORTFOLIO_CATEGORIES.filter((category) => values.includes(category)).join(",");
}

type PortfolioCaseRow = {
  id: string;
  title: string;
  description: string;
  price: string | null;
  material: string | null;
  leadTime: string | null;
  categories: string;
  beforeImageId: string | null;
  images: { id: string }[];
};

export function toPortfolioCaseData(row: PortfolioCaseRow): PortfolioCaseData {
  const beforeImage = row.images.find((image) => image.id === row.beforeImageId) ?? null;
  const images = row.images.filter((image) => image.id !== row.beforeImageId);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    material: row.material,
    leadTime: row.leadTime,
    categories: parseCategories(row.categories),
    // Если в кейсе одно фото и оно отмечено как «до», показываем его как обложку.
    images: images.length > 0 ? images : beforeImage ? [beforeImage] : [],
    beforeImage: images.length > 0 ? beforeImage : null,
  };
}

/** Строка «материал · срок» для карточки; null, если обоих полей нет. */
export function materialLeadTimeLine(item: PortfolioCaseData): string | null {
  const parts = [item.material, item.leadTime].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function imageUrl(imageId: string): string {
  return `/api/portfolio/images/${imageId}`;
}
