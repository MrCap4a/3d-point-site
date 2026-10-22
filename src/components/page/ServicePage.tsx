import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/page/PageHero";
import { InfoGrid } from "@/components/page/InfoGrid";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { RequestFormSection } from "@/components/forms/RequestFormSection";
import type { ServiceContent } from "@/content/services";
import { getPublishedCases } from "@/lib/portfolio-queries";
import { formatRub } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

/** Метаданные страницы услуги из её контента. */
export function serviceMetadata(service: ServiceContent) {
  return pageMetadata({ ...service.meta, path: `/${service.slug}` });
}

/**
 * Шаблон страницы услуги: hero, «Что делаем», «Что прислать для оценки»,
 * цена «от» (если задана), работы этой категории (если есть) и форма со
 * скрытым полем source.
 */
export async function ServicePage({ service }: { service: ServiceContent }) {
  const cases = await getPublishedCases({ category: service.portfolioCategory, take: 6 });

  return (
    <>
      <PageHero tag={service.navLabel} title={service.h1} description={service.subtitle} />

      <InfoGrid label="Что делаем" title="Чем можем помочь" columns={2} items={service.whatWeDo.map(toInfoItem)} />

      <InfoGrid
        label="Для оценки"
        title="Что прислать"
        description="Подойдёт то, что есть под рукой. Чем больше деталей, тем точнее оценка."
        background="muted"
        columns={4}
        items={service.whatToSend.map(toInfoItem)}
      />

      {service.priceFrom !== null && (
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-10 sm:py-16">
          <Container>
            <p className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:text-3xl">
              от {formatRub(service.priceFrom)}
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-2)]">
              Точную стоимость назовём после фото или осмотра. Оценка бесплатная.
            </p>
          </Container>
        </section>
      )}

      <PortfolioSection items={cases} label="Работы" title="Примеры работ" />

      <RequestFormSection
        title="Расскажите о задаче"
        description="Опишите, что нужно, и приложите фото, если есть, — мы свяжемся, чтобы обсудить детали."
        source={service.source}
      />
    </>
  );
}

function toInfoItem(item: { title: string; text: string }) {
  return { title: item.title, description: item.text };
}
