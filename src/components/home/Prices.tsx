import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRICES } from "@/content/site";
import { formatRub } from "@/lib/format";

/** «Сколько стоит» — только если в конфиге задан хотя бы один пункт PRICES. */
export function Prices() {
  if (PRICES.length === 0) return null;

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-12 sm:py-20">
      <Container>
        <SectionHeading label="Цены" title="Сколько стоит" />
        <ul className="mt-6 max-w-2xl divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] sm:mt-10">
          {PRICES.map((price) => (
            <li key={price.label} className="flex items-baseline justify-between gap-4 py-3.5">
              <span className="text-sm text-[var(--color-text)] sm:text-base">{price.label}</span>
              <span className="shrink-0 font-semibold text-[var(--color-text)]">от {formatRub(price.from)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--color-text-2)]">
          Точную стоимость назовём после фото или осмотра. Оценка бесплатная.
        </p>
      </Container>
    </section>
  );
}
