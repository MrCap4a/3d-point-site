import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import type { PortfolioCaseData } from "@/lib/portfolio";

/**
 * Секция с работами из портфолио и кнопкой «Все работы». Если работ нет,
 * не рендерится — заглушек вместо работ не ставим.
 */
export function PortfolioSection({
  items,
  label = "Работы",
  title = "Примеры работ",
  background = "muted",
}: {
  items: PortfolioCaseData[];
  label?: string;
  title?: string;
  background?: "default" | "muted";
}) {
  if (items.length === 0) return null;

  return (
    <section
      className={`border-b border-[var(--color-border)] py-12 sm:py-20 ${
        background === "muted" ? "bg-[var(--color-bg-2)]" : "bg-[var(--color-bg)]"
      }`}
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading label={label} title={title} />
          <Button href="/portfolio" variant="secondary" size="md" className="hidden sm:inline-flex">
            Все работы
          </Button>
        </div>
        <div className="mt-6 sm:mt-10">
          <PortfolioGrid items={items} />
        </div>
        <Button href="/portfolio" variant="secondary" size="md" className="mt-6 w-full sm:hidden">
          Все работы
        </Button>
      </Container>
    </section>
  );
}
