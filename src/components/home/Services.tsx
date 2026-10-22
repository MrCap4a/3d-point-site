import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOME_SERVICE_CARDS } from "@/content/services";

/** Сетка услуг: заголовок, строка описания и ссылка на страницу. */
export function Services() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-12 sm:py-20">
      <Container>
        <SectionHeading label="Услуги" title="С чем мы помогаем" />

        <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {HOME_SERVICE_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3.5 transition-colors hover:border-[var(--color-accent)] sm:p-6"
            >
              <h3 className="text-base font-semibold tracking-[-0.01em] text-[var(--color-text)] sm:text-lg">{card.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-2)] sm:mt-1.5">{card.text}</p>
              <span className="mt-4 hidden items-center gap-1.5 text-sm font-medium text-[var(--color-accent-text)] sm:inline-flex">
                Подробнее
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
