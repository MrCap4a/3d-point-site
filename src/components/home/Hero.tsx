import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HERO_IMAGE, RESPONSE_HOURS } from "@/content/site";
import { imageUrl, type PortfolioCaseData } from "@/lib/portfolio";

/**
 * Hero главной: бейдж, H1, короткий подзаголовок, две кнопки и визуал.
 * Визуал — HERO_IMAGE из конфига, а пока его нет — коллаж из трёх первых
 * фото портфолио. На десктопе визуал справа, на мобиле под кнопками.
 */
export function Hero({ collage }: { collage: PortfolioCaseData[] }) {
  const collageItems = collage.filter((item) => item.images[0]).slice(0, 3);

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-8 sm:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="mb-4 inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.05em] sm:px-3 sm:text-xs sm:tracking-[0.08em] text-[var(--color-accent-text)] sm:mb-5">
              3D-печать · 3D-сканирование · Ставрополь
            </p>
            <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl lg:text-[3.25rem]">
              Изготовление и восстановление пластиковых деталей в Ставрополе{" "}
              <span className="whitespace-nowrap">
                — <span className="text-[var(--color-accent)]">под ключ</span>
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-text-2)] sm:mt-6 sm:text-lg">
              Покажите, что сломалось или что нужно изготовить, — мы возьмём
              решение на себя и доведём до результата.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
              <Button href="#request-form" size="lg" className="w-full sm:w-auto" data-hero-cta>
                Оставить заявку
              </Button>
              <Button href="/portfolio" variant="secondary" size="lg" className="w-full sm:w-auto">
                Смотреть работы
              </Button>
            </div>
            <p className="mt-4 text-sm text-[var(--color-text-2)]">
              Оценка по фото — бесплатно
              {RESPONSE_HOURS !== null && ` · Отвечаем в течение ${RESPONSE_HOURS} ч`}
            </p>
          </div>

          {HERO_IMAGE ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg-2)]">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : collageItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {collageItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg-2)] ${
                    index === 2 || collageItems.length === 1 ? "col-span-2 aspect-[2/1]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={imageUrl(item.images[0].id)}
                    alt={item.title}
                    fill
                    priority
                    sizes={index === 2 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
