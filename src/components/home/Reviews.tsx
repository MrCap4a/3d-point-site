import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { REVIEWS, REVIEW_SOURCE_LABELS } from "@/content/site";
import { formatDate } from "@/lib/format";

/** Отзывы из конфига REVIEWS. Пустой массив — блок не показывается. */
export function Reviews() {
  if (REVIEWS.length === 0) return null;

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] py-12 sm:py-20">
      <Container>
        <SectionHeading label="Отзывы" title="Что говорят клиенты" />
        <div className="mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure
              key={`${review.author}-${review.date}`}
              className="flex flex-col rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-[var(--color-text)] sm:text-base">
                {review.text}
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-[var(--color-text)]">{review.author}</span>
                <span className="block text-[var(--color-text-2)]">
                  {REVIEW_SOURCE_LABELS[review.source]} · {formatDate(review.date)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
