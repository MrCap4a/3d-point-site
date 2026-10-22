import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type Step = {
  number: string;
  title: string;
  description: string;
};

type StepsSectionProps = {
  label: string;
  title: string;
  description?: string;
  steps: Step[];
  background?: "default" | "muted";
};

/**
 * Универсальная секция шагов ("как проходит работа") с крупными номерами и
 * тонкой линией сверху вместо кружков — переиспользуется на главной и на
 * коммерческих страницах, где последовательность шагов отличается под
 * конкретную аудиторию.
 */
export function StepsSection({
  label,
  title,
  description,
  steps,
  background = "muted",
}: StepsSectionProps) {
  const bgClass = background === "muted" ? "bg-[var(--color-bg-2)]" : "bg-[var(--color-bg)]";
  const columns = steps.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className={`border-b border-[var(--color-border)] py-11 sm:py-24 ${bgClass}`}>
      <Container>
        <SectionHeading label={label} title={title} description={description} />

        <div className={`mt-7 grid gap-6 sm:mt-14 sm:gap-10 sm:grid-cols-2 ${columns}`}>
          {steps.map((step) => (
            <div key={step.number} className="border-t border-[var(--color-border)] pt-4 sm:pt-6">
              <span className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-accent)] sm:text-3xl">
                {step.number}
              </span>
              <h3 className="mt-2 text-base sm:mt-4 font-semibold text-[var(--color-text)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
