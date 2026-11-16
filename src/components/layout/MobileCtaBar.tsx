"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaxIcon, PhoneIcon, TelegramIcon } from "@/components/ui/icons";
import { getPrimaryCta } from "@/lib/nav";
import type { SiteContacts } from "@/lib/contacts";

const buttonBase =
  "inline-flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] px-1 py-2 text-xs font-medium";
const secondary = `${buttonBase} border border-[var(--color-border)] text-[var(--color-text)] active:bg-[var(--color-bg-2)]`;

/** Контакты доступны с первого экрана. Цели отправляет MetrikaLinkGoals. */
export function MobileCtaBar({ contacts }: { contacts: SiteContacts }) {
  const pathname = usePathname() ?? "/";
  const cta = getPrimaryCta(pathname);

  return (
    <nav
      aria-label="Быстрая связь"
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden"
    >
      <Link href={cta.href} className={`${buttonBase} bg-[var(--color-accent)] text-white active:bg-[var(--color-accent-hover)]`}>
        <span className="flex h-4 items-center text-base leading-none" aria-hidden="true">+</span>
        Заявка
      </Link>
      {contacts.phone && (
        <a href={contacts.phone.href} className={secondary} aria-label={`Позвонить: ${contacts.phone.label}. Этот номер также есть в MAX`}>
          <PhoneIcon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          Позвонить
        </a>
      )}
      {contacts.telegram && (
        <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className={secondary} aria-label={`Написать в Telegram: ${contacts.telegram.label}`}>
          <TelegramIcon className="h-4 w-4 shrink-0 text-[#229ED9]" />
          Telegram
        </a>
      )}
      {contacts.max && (
        <a href={contacts.max.href} target="_blank" rel="noopener noreferrer" className={secondary} aria-label="Написать в MAX">
          <MaxIcon className="h-4 w-4 shrink-0" />
          MAX
        </a>
      )}
    </nav>
  );
}
