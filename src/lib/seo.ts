import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://3-dpoint.ru";

/**
 * Метаданные страницы: title, description, canonical, Open Graph и Twitter
 * с одинаковыми значениями. title передаётся целиком (с « — 3Дточка»).
 * openGraph страницы заменяет openGraph layout целиком, поэтому общие поля
 * (тип, локаль, имя сайта) задаются здесь.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: "3Дточка",
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
