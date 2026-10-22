import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { COMPANY } from "@/lib/company";
import { LEGAL_EMAIL } from "@/content/site";

/**
 * Каркас правовой страницы (/privacy, /consent). Сверху HTML-комментарий
 * для юриста — React не умеет выводить комментарии напрямую, поэтому он
 * вставляется через скрытый контейнер.
 */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="bg-[var(--color-bg)] py-10 sm:py-20">
      <div hidden dangerouslySetInnerHTML={{ __html: "<!-- TODO: проверить юристом -->" }} />
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-text-2)]">Редакция от {updated}</p>
          <div className="legal-text mt-8 text-[0.9375rem] leading-relaxed text-[var(--color-text)] sm:text-base">
            {children}
          </div>
        </div>
      </Container>
    </article>
  );
}

/** Контакт для обращений: email из конфига, пока его нет — телефон. */
export function LegalContact() {
  if (LEGAL_EMAIL) {
    return (
      <>
        по электронной почте{" "}
        <a href={`mailto:${LEGAL_EMAIL}`} className="underline underline-offset-2">
          {LEGAL_EMAIL}
        </a>
      </>
    );
  }
  return (
    <>
      по телефону{" "}
      <a href={`tel:${COMPANY.phone.href}`} className="underline underline-offset-2">
        {COMPANY.phone.display}
      </a>
    </>
  );
}

export const OPERATOR_TEXT = `${COMPANY.legalName}, ИНН ${COMPANY.inn}`;
