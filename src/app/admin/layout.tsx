import type { ReactNode } from "react";
import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Админка — 3Dpoint / 3Дточка",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Root layout админки — намеренно без счётчика Яндекс Метрики: вебвизор не
 * должен записывать экраны с заявками клиентов. Отдельный root layout (а не
 * условие в общем) гарантирует полную перезагрузку при переходе с
 * публичной части, так что уже загруженный tag.js сюда не переносится.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
