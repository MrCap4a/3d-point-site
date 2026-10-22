"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon, TelegramIcon } from "@/components/ui/icons";
import { getPrimaryCta } from "@/lib/nav";
import type { SiteContacts } from "@/lib/contacts";

const buttonBase =
  "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-3 text-sm font-medium";
const secondary = `${buttonBase} border border-[var(--color-border)] text-[var(--color-text)] active:bg-[var(--color-bg-2)]`;

/**
 * Липкая нижняя панель для мобильных экранов: «Заявка · Позвонить ·
 * Telegram». Появляется, когда кнопка в hero (элемент с data-hero-cta) ушла
 * за верхний край экрана, и прячется, пока форма заявки (#request-form) в
 * зоне видимости. На страницах без hero-кнопки видна сразу. Цели Метрики
 * для звонка и Telegram ставит MetrikaLinkGoals по ссылкам tel:/t.me.
 */
export function MobileCtaBar({ contacts }: { contacts: SiteContacts }) {
  const pathname = usePathname() ?? "/";
  const cta = getPrimaryCta(pathname);
  const [heroPassed, setHeroPassed] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero-cta]");
    const form = document.getElementById("request-form");
    const observers: IntersectionObserver[] = [];

    // Состояние для новой страницы определяется наблюдателями ниже; без
    // hero-кнопки панель видна сразу.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeroPassed(!hero);
    setFormVisible(false);

    if (hero) {
      const observer = new IntersectionObserver(([entry]) => {
        setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      observer.observe(hero);
      observers.push(observer);
    }

    if (form) {
      const observer = new IntersectionObserver(([entry]) => {
        setFormVisible(entry.isIntersecting);
      });
      observer.observe(form);
      observers.push(observer);
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, [pathname]);

  const visible = heroPassed && !formVisible;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 p-3 backdrop-blur-sm transition-transform duration-200 lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <Link
        href={cta.href}
        tabIndex={visible ? undefined : -1}
        className={`${buttonBase} bg-[var(--color-accent)] text-white active:bg-[var(--color-accent-hover)]`}
      >
        Заявка
      </Link>
      {contacts.phone && (
        <a
          href={contacts.phone.href}
          tabIndex={visible ? undefined : -1}
          className={secondary}
          aria-label={`Позвонить: ${contacts.phone.label}`}
        >
          <PhoneIcon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          Позвонить
        </a>
      )}
      {contacts.telegram && (
        <a
          href={contacts.telegram.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? undefined : -1}
          className={secondary}
          aria-label={`Написать в Telegram: ${contacts.telegram.label}`}
        >
          <TelegramIcon className="h-4 w-4 shrink-0 text-[#229ED9]" />
          Telegram
        </a>
      )}
    </div>
  );
}
