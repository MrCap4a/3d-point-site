import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type PageHeroProps = {
  tag: string;
  title: ReactNode;
  description: string;
  ctaLabel?: string;
};

/**
 * Единый hero-блок для внутренних страниц (/private, /business, страницы
 * услуг). Меньше по высоте, чем hero главной. Кнопка помечена
 * data-hero-cta — по ней мобильная нижняя панель понимает, когда появиться.
 */
export function PageHero({ tag, title, description, ctaLabel = "Оставить заявку" }: PageHeroProps) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-10 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex sm:mb-5 items-center rounded-[var(--radius-sm)] border border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-accent-text)]">
            {tag}
          </p>
          <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed sm:mt-6 sm:text-lg text-[var(--color-text-2)]">
            {description}
          </p>
          <div className="mt-6 sm:mt-9">
            <Button href="#request-form" size="lg" className="w-full sm:w-auto" data-hero-cta>
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
