import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  "Вы присылаете фото, образец или описание задачи.",
  "Мы связываемся и уточняем детали.",
  "Согласовываем решение, сроки и стоимость.",
  "Изготавливаем и доводим до результата.",
];

/** Четыре шага, по одной строке. На мобиле — компактный вертикальный список. */
export function HowWeWork() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-12 sm:py-20">
      <Container>
        <SectionHeading label="Как мы работаем" title="От сообщения до готовой детали" />

        <ol className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="flex items-baseline gap-3 border-t border-[var(--color-border)] pt-3 sm:block sm:pt-5"
            >
              <span className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-accent-text)] sm:text-3xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-[var(--color-text)] sm:mt-3 sm:text-base">{step}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
