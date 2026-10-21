"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getPrimaryCta } from "@/lib/nav";
import type { SiteContacts } from "@/lib/contacts";

const contactClasses =
  "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-2)]";

/**
 * Закреплённая снизу CTA-панель только для мобильных экранов (на lg и выше
 * основной CTA уже всегда виден в шапке). Рядом с CTA — быстрые ссылки на
 * телефон и Telegram из настроек админки, если они заданы. Админка сюда не
 * попадает: у неё свой root layout.
 */
export function MobileCtaBar({ contacts }: { contacts: SiteContacts }) {
  const pathname = usePathname() ?? "/";
  const cta = getPrimaryCta(pathname);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 p-3 backdrop-blur-sm lg:hidden">
      <Button href={cta.href} size="md" className="min-w-0 flex-1">
        {cta.label}
      </Button>
      {contacts.phone && (
        <a href={contacts.phone.href} className={contactClasses} aria-label={`Позвонить: ${contacts.phone.label}`}>
          Позвонить
        </a>
      )}
      {contacts.telegram && (
        <a
          href={contacts.telegram.href}
          target="_blank"
          rel="noopener noreferrer"
          className={contactClasses}
          aria-label={`Написать в Telegram: ${contacts.telegram.label}`}
        >
          Telegram
        </a>
      )}
    </div>
  );
}
