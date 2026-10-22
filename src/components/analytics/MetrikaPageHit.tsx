"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { METRIKA_ID } from "@/lib/metrika";

/**
 * Хиты Метрики при клиентских переходах через next/link: tag.js сам их не
 * видит. Первый хит на загрузке страницы уже отправил init, поэтому на
 * первом рендере только запоминаем адрес — без дубля.
 */
export function MetrikaPageHit() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    if (METRIKA_ID === null) return;
    const url = window.location.href;

    if (prevUrl.current !== null && prevUrl.current !== url) {
      window.ym?.(METRIKA_ID, "hit", url, { referer: prevUrl.current });
    }
    prevUrl.current = url;
  }, [pathname, searchParams]);

  return null;
}
