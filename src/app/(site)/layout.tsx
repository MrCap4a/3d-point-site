import { Suspense } from "react";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { MetrikaPageHit } from "@/components/analytics/MetrikaPageHit";
import { getSiteContacts } from "@/lib/contacts";
import { inter } from "@/lib/fonts";
import { METRIKA_INIT_OPTIONS_JS } from "@/lib/metrika";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://3-dpoint.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "3Dpoint / 3Дточка — изготовление и восстановление пластиковых деталей",
    template: "%s — 3Dpoint / 3Дточка",
  },
  description:
    "Изготовление и восстановление пластиковых деталей под ключ. Покажите проблему — мы возьмём решение на себя и доведём до результата.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "3Dpoint / 3Дточка",
    title: "3Dpoint / 3Дточка — изготовление и восстановление пластиковых деталей",
    description:
      "Изготовление и восстановление пластиковых деталей под ключ. Покажите проблему — мы возьмём решение на себя и доведём до результата.",
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Код счётчика Яндекс Метрики из кабинета Метрики, не менять. Статические
// параметры init подставляются из METRIKA_INIT_OPTIONS — те же, что у
// запасного запуска на 404 (MetrikaNotFoundInit), чтобы не разъехались.
const YANDEX_METRIKA_SCRIPT = `
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109128994', 'ym');

    ym(109128994, 'init', {${METRIKA_INIT_OPTIONS_JS}, referrer: document.referrer, url: location.href});
`;

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E85D26" },
    { media: "(prefers-color-scheme: dark)", color: "#16160F" },
  ],
};

/**
 * Root layout публичной части сайта (все страницы, кроме /admin). У админки
 * свой root layout (app/admin/layout.tsx) — без счётчика Метрики: переход
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
        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: YANDEX_METRIKA_SCRIPT }}
        />
        {/* /Yandex.Metrika counter */}
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        {/* Yandex.Metrika noscript-пиксель: <img> внутри <head> — невалидный HTML, поэтому он в начале body. */}
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/109128994"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <Suspense fallback={null}>
          <MetrikaPageHit />
        </Suspense>
        <OrganizationJsonLd />
        <Header />
        <main className="flex flex-1 flex-col pb-20 lg:pb-0">{children}</main>
        <Footer contacts={contacts} />
        <MobileCtaBar contacts={contacts} />
      </body>
    </html>
  );
}
