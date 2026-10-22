import { Container } from "@/components/ui/Container";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { RequestFormSection } from "@/components/forms/RequestFormSection";
import { getPublishedCases } from "@/lib/portfolio-queries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Примеры работ: 3D-печать и восстановление деталей в Ставрополе — 3Дточка",
  description:
    "Реальные задачи: восстановленные и изготовленные заново пластиковые детали для частных клиентов и бизнеса.",
  path: "/portfolio",
});

// Страница читает опубликованные кейсы из БД; без ревалидации Next.js
// закэшировал бы её статически на момент сборки, и новые кейсы из админки
// не появлялись бы без передеплоя.
export const revalidate = 60;

export default async function PortfolioPage() {
  const cases = await getPublishedCases();

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-10 sm:py-20">
        <Container>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-3)]">Работы</p>
          <h1 className="max-w-3xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl">
            Реальные задачи, которые мы решили
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-2)] sm:text-lg">
            {cases.length > 0
              ? "Нажмите на работу, чтобы посмотреть подробности. Если нужно похожее — оставьте заявку прямо из карточки."
              : "Мы наполняем этот раздел реальными работами. Расскажите о своей задаче — форма ниже."}
          </p>

          {cases.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <PortfolioGrid items={cases} priorityCount={2} />
            </div>
          )}
        </Container>
      </section>

      <RequestFormSection
        title="Нужно что-то похожее?"
        description="Опишите задачу или нажмите «Нужно похожее» в карточке работы — мы свяжемся, чтобы обсудить детали."
      />
    </>
  );
}
