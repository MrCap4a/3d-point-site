import { Suspense } from "react";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { MetrikaPageHit } from "@/components/analytics/MetrikaPageHit";
import { MetrikaLinkGoals } from "@/components/analytics/MetrikaLinkGoals";
import { CookieBanner } from "@/components/analytics/CookieBanner";
import { getSiteContacts } from "@/lib/contacts";
import { inter } from "@/lib/fonts";
import { METRIKA_ID, METRIKA_SCRIPT } from "@/lib/metrika";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import "../globals.css";

const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: "3D-печать и изготовление пластиковых деталей в Ставрополе — 3Дточка",
    description:
      "Изготовим или восстановим пластиковую деталь по образцу, фото или чертежу. 3D-печать, 3D-сканирование и моделирование в Ставрополе. Выезд к клиенту.",
    path: "/",
  }),
  // Страницы задают title целиком; шаблон нужен для 404 и прочих страниц без своего title.
  title: {
    default: "3D-печать и изготовление пластиковых деталей в Ставрополе — 3Дточка",
    template: "%s — 3Дточка",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Метатег yandex-verification — только если задан код Яндекс Вебмастера.
  ...(yandexVerification ? { verification: { yandex: yandexVerification } } : {}),
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E85D26" },
    { media: "(prefers-color-scheme: dark)", color: "#16160F" },
  ],
};

/**
 * Root layout публичной части сайта (все страницы, кроме /admin). Счётчик
 * Метрики подключается, только если задан NEXT_PUBLIC_YM_ID (см. @/lib/metrika).
 * У админки свой root layout (app/admin/layout.tsx) — без счётчика: переход
 * между разными root layout в Next.js делает полную перезагрузку страницы,
 * поэтому tag.js и вебвизор в админку не попадают. Типизируем children
 * напрямую, а не через LayoutProps: группа применяется сразу к нескольким
 * маршрутам, а не к одному конкретному сегменту.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const contacts = await getSiteContacts();

  return (
    <html lang="ru" className={`${inter.variable} h-full`}>
      <head>
        {METRIKA_SCRIPT && (
          <>
            {/* Yandex.Metrika counter */}
            <script type="text/javascript" dangerouslySetInnerHTML={{ __html: METRIKA_SCRIPT }} />
            {/* /Yandex.Metrika counter */}
          </>
        )}
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        {/* Yandex.Metrika noscript-пиксель: <img> внутри <head> — невалидный HTML, поэтому он в начале body. */}
        {METRIKA_ID !== null && (
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        )}
        <Suspense fallback={null}>
          <MetrikaPageHit />
        </Suspense>
        <MetrikaLinkGoals />
        <LocalBusinessJsonLd />
        <Header contacts={contacts} />
        <main className="flex flex-1 flex-col pb-20 lg:pb-0">{children}</main>
        <Footer contacts={contacts} />
        <MobileCtaBar contacts={contacts} />
        <CookieBanner />
      </body>
    </html>
  );
}
