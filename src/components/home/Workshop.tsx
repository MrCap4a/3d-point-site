import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WORKSHOP_IMAGES } from "@/content/site";

/**
 * «Мастерская» — без фото и имени владельца: только оборудование и процесс.
 * Фото берутся из WORKSHOP_IMAGES; пока массив пуст, сетка не выводится.
 */
export function Workshop() {
  const images = WORKSHOP_IMAGES.slice(0, 4);

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-12 sm:py-20">
      <Container>
        <SectionHeading
          label="О нас"
          title="Мастерская"
          description="Печатаем инженерными пластиками: PLA, PETG, ABS, ASA, ASA-CF, PA6-CF, TPU. Снимаем геометрию 3D-сканером, моделируем под задачу."
        />
        {images.length > 0 && (
          <div className={`mt-6 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 ${images.length > 2 ? "lg:grid-cols-4" : ""}`}>
            {images.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg-2)]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
