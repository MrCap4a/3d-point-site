"use client";

import { useEffect } from "react";
import { METRIKA_ID, reachGoal } from "@/lib/metrika";

/**
 * Цели phone_click и telegram_click для всех ссылок tel: и t.me на сайте —
 * одним делегированным обработчиком, чтобы не навешивать цели в каждом
 * месте, где выводится телефон или Telegram.
 */
export function MetrikaLinkGoals() {
  useEffect(() => {
    if (METRIKA_ID === null) return;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        reachGoal("phone_click");
      } else if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(href)) {
        reachGoal("telegram_click");
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
