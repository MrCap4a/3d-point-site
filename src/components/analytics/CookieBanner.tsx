"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { METRIKA_ID } from "@/lib/metrika";

const STORAGE_KEY = "cookie-notice-accepted";

/**
 * Небольшое уведомление о cookie, пока подключена Яндекс Метрика. Не
 * блокирует контент; «Понятно» запоминается в localStorage этого браузера.
 * На мобиле стоит над нижней панелью с кнопками.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (METRIKA_ID === null) return;
    let accepted = false;
    try {
      accepted = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // localStorage недоступен (приватный режим и т.п.) — просто показываем.
    }
    if (!accepted) {
      // Показ после монтирования: на сервере localStorage не прочитать.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Не удалось запомнить — баннер появится снова при следующем визите.
    }
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Уведомление о cookie"
      className="fixed inset-x-3 bottom-20 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm text-[var(--color-text-2)] shadow-lg lg:bottom-6"
    >
      <p className="min-w-0 flex-1">
        Сайт использует cookie и Яндекс Метрику, чтобы понимать, как им
        пользуются. Подробнее — в{" "}
        <Link href="/privacy" className="font-medium text-[var(--color-text)] underline underline-offset-2">
          политике
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={accept}
        className="rounded-[var(--radius-sm)] bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:opacity-90"
      >
        Понятно
      </button>
    </div>
  );
}
