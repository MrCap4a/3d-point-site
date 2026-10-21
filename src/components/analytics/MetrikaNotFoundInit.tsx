"use client";

import { useEffect, useRef } from "react";
import { METRIKA_ID, METRIKA_INIT_OPTIONS, METRIKA_TAG_URL } from "@/lib/metrika";

/**
 * Запасной запуск счётчика на странице 404. При прямом заходе на
 * несуществующий адрес Next отдаёт HTML-оболочку, а страницу дорисовывает
 * на клиенте — inline-скрипт счётчика из layout в этом случае не
 * выполняется. Тогда подключаем tag.js и делаем init здесь (init сам
 * отправит хит). Если ym уже есть — это клиентский переход на 404 с
 * другой страницы: хит отправит MetrikaPageHit, инициализировать не нужно.
 * В обоих случаях передаём параметр визита not_found с битым адресом.
 */
export function MetrikaNotFoundInit() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    if (typeof window.ym !== "function") {
      const ym: NonNullable<Window["ym"]> = function () {
        // eslint-disable-next-line prefer-rest-params
        (ym.a = ym.a || []).push(arguments);
      };
      ym.l = Date.now();
      window.ym = ym;

      const alreadyLoaded = Array.from(document.scripts).some((s) => s.src === METRIKA_TAG_URL);
      if (!alreadyLoaded) {
        const script = document.createElement("script");
        script.async = true;
        script.src = METRIKA_TAG_URL;
        document.head.appendChild(script);
      }

      window.ym(METRIKA_ID, "init", {
        ...METRIKA_INIT_OPTIONS,
        referrer: document.referrer,
        url: location.href,
      });
    }

    window.ym?.(METRIKA_ID, "params", { not_found: location.pathname });
  }, []);

  return null;
}
