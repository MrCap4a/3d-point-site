import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/page/PageHero";
import { InfoGrid } from "@/components/page/InfoGrid";
import { StepsSection } from "@/components/page/StepsSection";
import { Callout } from "@/components/page/Callout";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { RequestFormSection } from "@/components/forms/RequestFormSection";
import { B2B_TERMS, SERIAL_MAX, SERIAL_MIN } from "@/content/site";
import { getPublishedCases } from "@/lib/portfolio-queries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Пластиковые детали для оборудования и малые серии в Ставрополе — 3Дточка",
  description:
    "Замена пластиковых деталей оборудования по образцу, выезд на объект, малые серии. Безналичный расчёт.",
  path: "/business",
});

// Работы портфолио читаются из БД — обновляем раз в минуту.
export const revalidate = 60;

/** Фраза про малые серии: с диапазоном, только если он задан в конфиге. */
function serialText(): string {
  if (SERIAL_MAX === null) {
    return "Изготавливаем малые серии — объём и сроки согласуем заранее.";
  }
  const range = SERIAL_MIN !== null ? `от ${SERIAL_MIN} до ${SERIAL_MAX}` : `до ${SERIAL_MAX}`;
  return `Нужна не одна деталь, а партия? Изготовим серию ${range} шт. — сроки согласуем до начала работы.`;
}

export default async function BusinessPage() {
  const cases = await getPublishedCases({ category: "business", take: 3 });

  return (
    <>
      <PageHero
        tag="Бизнесу"
        title={
          <>
            Оборудование простаивает —
            <br className="hidden sm:block" /> мы приезжаем и берём задачу на себя
          </>
        }
        description="Пластиковая деталь вышла из строя, а простой оборудования обходится дороже самой детали. Разбираемся в задаче и изготавливаем замену под ключ."
      />

      <Callout>
        Мы понимаем, насколько дорого может обходиться простой оборудования,
        поэтому бизнес-заказы обрабатываем в приоритетном порядке.
      </Callout>

      <InfoGrid
        label="Возможности для бизнеса"
        title="Как мы можем помочь"
        background="muted"
        columns={2}
        items={[
          {
            title: "Выезд на объект",
            description:
              "При необходимости выезжаем на место, чтобы оценить задачу и снять размеры с оборудования.",
          },
          {
            title: "Работа по любым материалам",
            description:
              "Принимаем образец, фото, чертёж или техническую документацию — работаем с тем, что есть.",
          },
          {
            title: "Изготовление замены",
            description:
              "Восстанавливаем сломанную деталь или изготавливаем замену отсутствующей — по образцу или с нуля.",
          },
          {
            title: "Повторное изготовление",
            description:
              "Если деталь понадобится снова, повторное изготовление проходит быстрее — задача уже знакома.",
          },
        ]}
      />

      <section id="serial" className="scroll-mt-20 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-11 sm:py-24">
        <Container>
          <SectionHeading label="Партии деталей" title="Малые серии" description={serialText()} />
          <div className="mt-7 grid gap-x-10 gap-y-6 sm:mt-12 sm:grid-cols-3 sm:gap-y-10">
            {[
              {
                title: "Согласуем заранее",
                description: "Количество и сроки обсуждаем и фиксируем до начала работы.",
              },
              {
                title: "Можно начать с образца",
                description: "Сначала изготовим пробную деталь, чтобы согласовать результат, — потом партию.",
              },
              {
                title: "Без своего производства",
                description: "Не нужно организовывать выпуск самостоятельно — берём его на себя.",
              },
            ].map((item) => (
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

      {B2B_TERMS && B2B_TERMS.length > 0 && (
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] py-11 sm:py-24">
          <Container>
            <SectionHeading label="Документы и оплата" title="Работа с юрлицами" />
            <ul className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-2">
              {B2B_TERMS.map((term) => (
                <li key={term} className="flex gap-3 text-sm leading-relaxed text-[var(--color-text)] sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                  {term}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <PortfolioSection items={cases} label="Работы" title="Задачи, которые мы решили для бизнеса" />

      <StepsSection
        label="Как проходит работа"
        title="От заявки до решения проблемы"
        background="default"
        steps={[
          {
            number: "01",
            title: "Оставляете заявку",
            description: "Кратко описываете задачу — бизнес-обращения обрабатываем в приоритетном порядке.",
          },
          {
            number: "02",
            title: "Оцениваем задачу",
            description: "Изучаем фото, документацию или, при необходимости, выезжаем на объект.",
          },
          {
            number: "03",
            title: "Согласовываем решение",
            description: "Обсуждаем стоимость и сроки изготовления до начала работы.",
          },
          {
            number: "04",
            title: "Изготавливаем и доставляем",
            description: "Возвращаем оборудование в работу — доставляем деталь или устанавливаем на месте.",
          },
        ]}
      />

      <RequestFormSection
        title="Расскажите о задаче"
        description="Кратко опишите, что случилось с оборудованием или какая партия нужна, — мы свяжемся, чтобы обсудить детали и сроки."
        defaultClientType="BUSINESS"
      />
    </>
  );
}
