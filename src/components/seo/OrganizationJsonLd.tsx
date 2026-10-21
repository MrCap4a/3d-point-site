import { COMPANY } from "@/lib/company";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://3-dpoint.ru";

/**
 * Структурированные данные Organization для поисковиков. Контактные данные
 * (телефон, Telegram) подтверждены владельцем и вынесены в @/lib/company.
 * Адрес по-прежнему не указываем — производство без публичного офиса.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "3Dpoint / 3Дточка",
    url: siteUrl,
    description:
      "Изготовление и восстановление пластиковых деталей под ключ методом FDM 3D-печати.",
    telephone: COMPANY.phone.href,
    sameAs: [COMPANY.telegram.url],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone.href,
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: "ru",
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
