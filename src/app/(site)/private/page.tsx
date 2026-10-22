import { PageHero } from "@/components/page/PageHero";
import { InfoGrid } from "@/components/page/InfoGrid";
import { StepsSection } from "@/components/page/StepsSection";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { RequestFormSection } from "@/components/forms/RequestFormSection";
import { getPublishedCases } from "@/lib/portfolio-queries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Изготовить пластиковую деталь по образцу в Ставрополе — 3Дточка",
  description:
    "Сломалась пластиковая деталь или её больше не продают? Сделаем замену по образцу или фото. Оценка по фото бесплатно.",
  path: "/private",
});

// Работы портфолио читаются из БД — обновляем раз в минуту.
export const revalidate = 60;

export default async function PrivatePage() {
  const cases = await getPublishedCases({ category: "private", take: 3 });

  return (
    <>
      <PageHero
        tag="Частным лицам"
        title={
          <>
            Покажите, что сломалось, —
            <br className="hidden sm:block" /> мы разберёмся с решением
          </>
        }
        description="Не нужно искать модель, разбираться в материалах или технологиях. Достаточно показать проблему — остальное возьмём на себя. Работаем в Ставрополе, отправляем доставкой."
      />

      <InfoGrid
        label="Знакомая ситуация?"
        title="Когда к нам обращаются"
        columns={2}
        items={[
          {
            title: "Деталь сломалась",
            description:
              "Отломился крепёж, треснул корпус, стёрлась шестерня — если деталь пластиковая, скорее всего, мы сможем её восстановить.",
          },
          {
            title: "Деталь больше не продаётся",
            description:
              "Модель снята с производства, оригинальной запчасти нет в наличии — мы изготовим замену по образцу, фото или размерам.",
          },
          {
            title: "Нужно что-то нестандартное",
            description:
              "Требуется деталь, которой не существует в готовом виде, — обсудим задачу и при необходимости разработаем нужную геометрию.",
          },
          {
            title: "Нет 3D-модели и это нормально",
            description:
              "Не обязательно иметь готовую 3D-модель. Присылайте фото, образец или просто размеры — модель при необходимости сделаем сами.",
          },
        ]}
      />

      <PortfolioSection items={cases} label="Работы" title="Что мы уже сделали для частных клиентов" />

      <StepsSection
        label="Как проходит работа"
        title="От сообщения до готовой детали"
        background="default"
        steps={[
          {
            number: "01",
            title: "Показываете, что нужно",
            description: "Фото, образец, чертёж или просто описание — присылайте то, что есть.",
          },
          {
            number: "02",
            title: "Согласовываем решение",
            description: "Обсуждаем задачу, стоимость и сроки до начала работы — без сюрпризов.",
          },
          {
            number: "03",
            title: "Изготавливаем",
            description: "Сами подбираем материал и способ изготовления под вашу задачу.",
          },
          {
            number: "04",
            title: "Доставляем результат",
            description: "Готовое изделие отправляем доставкой либо передаём при встрече.",
          },
        ]}
      />

      <RequestFormSection
        title="Расскажите, что у вас случилось"
        description="Достаточно пары предложений и контакта — мы сами свяжемся, чтобы обсудить детали."
        defaultClientType="PRIVATE"
      />
    </>
  );
}
