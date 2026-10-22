import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type InfoItem = {
  title: string;
  description: string;
};

type InfoGridProps = {
  label: string;
  title: string;
  description?: string;
  items: InfoItem[];
  background?: "default" | "muted";
  columns?: 2 | 3 | 4;
};

const columnClasses: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Универсальная сетка "заголовок + список пунктов" — переиспользуется на
 * коммерческих страницах для блоков вроде "Типичные ситуации", "Что вам НЕ
 * нужно делать", "Возможности для бизнеса" и т.п., без создания отдельного
 * компонента под каждый такой блок.
 */
export function InfoGrid({
  label,
  title,
  description,
  items,
  background = "default",
  columns = 2,
}: InfoGridProps) {
  const bgClass = background === "muted" ? "bg-[var(--color-bg-2)]" : "bg-[var(--color-bg)]";

  return (
    <section className={`border-b border-[var(--color-border)] py-11 sm:py-24 ${bgClass}`}>
      <Container>
        <SectionHeading label={label} title={title} description={description} />

        <div className={`mt-7 grid sm:mt-12 gap-x-10 gap-y-6 sm:gap-y-10 ${columnClasses[columns]}`}>
          {items.map((item) => (
            <div key={item.title} className="border-t border-[var(--color-border)] pt-4 sm:pt-6">
              <h3 className="text-base font-semibold text-[var(--color-text)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)] sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
