import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const REASONS = [
  {
    title: "Не нужна 3D-модель",
    description: "Хватит фото, образца или размеров — геометрию воссоздадим сами.",
  },
  {
    title: "Работаем до результата",
    description: "Задача закрыта, когда деталь решила проблему, а не когда её напечатали.",
  },
  {
    title: "Выезд к клиенту",
    description: "Для бизнеса приезжаем на объект, чтобы посмотреть и снять размеры.",
  },
  {
    title: "Доставка",
    description: "Приезжать к нам необязательно — готовую деталь отправим.",
  },
];

/** «Почему мы»: объединённый блок, четыре пункта. */
export function WhyUs() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] py-12 sm:py-20">
      <Container>
        <SectionHeading label="Почему мы" title="Берём задачу под ключ" />

        <div className="mt-6 grid gap-x-10 gap-y-5 sm:mt-10 sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <div key={reason.title} className="border-t border-[var(--color-border)] pt-4 sm:pt-5">
              <h3 className="text-base font-semibold text-[var(--color-text)]">{reason.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-2)] sm:text-base">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
