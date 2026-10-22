import { COMPANY } from "@/lib/company";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://3-dpoint.ru";

/**
 * Структурированные данные LocalBusiness для поисковиков. Адрес — только
 * город и регион, без улицы: у мастерской нет публичного офиса.
 */
export function LocalBusinessJsonLd({ maxHref = null }: { maxHref?: string | null }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "3Дточка",
    alternateName: "3Dpoint",
    url: siteUrl,
    description:
      "Изготовление и восстановление пластиковых деталей: 3D-печать, 3D-сканирование и моделирование.",
    telephone: COMPANY.phone.href,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ставрополь",
      addressRegion: "Ставропольский край",
      addressCountry: "RU",
    },
    areaServed: "Ставрополь",
    sameAs: [COMPANY.telegram.url, ...(maxHref ? [maxHref] : [])],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
