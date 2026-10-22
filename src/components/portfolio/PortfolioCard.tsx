"use client";

import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { imageUrl, materialLeadTimeLine, type PortfolioCaseData } from "@/lib/portfolio";

type PortfolioCardProps = {
  item: PortfolioCaseData;
  onOpen: (item: PortfolioCaseData, trigger: HTMLButtonElement) => void;
  priority?: boolean;
};

/**
 * Карточка кейса: фото, заголовок, цена и строка «материал · срок» (если
 * заданы). По клику открывает модалку с полным описанием.
 */
export function PortfolioCard({ item, onOpen, priority = false }: PortfolioCardProps) {
  const cover = item.images[0];
  const details = materialLeadTimeLine(item);

  return (
    <button
      type="button"
      onClick={(event) => onOpen(item, event.currentTarget)}
      className="group block w-full rounded-[var(--radius-md)] text-left"
      aria-haspopup="dialog"
    >
      {cover ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg-2)]">
          <Image
            src={imageUrl(cover.id)}
            alt={item.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <PlaceholderImage className="aspect-[4/3] w-full rounded-[var(--radius-md)]" />
      )}
      <p className="mt-2.5 text-sm font-medium leading-snug text-[var(--color-text)] sm:mt-3 sm:text-base">
        {item.title}
      </p>
      {item.price && (
        <p className="mt-1 text-sm font-semibold text-[var(--color-text)] sm:text-base">{item.price}</p>
      )}
      {details && <p className="mt-1 text-xs text-[var(--color-text-2)] sm:text-sm">{details}</p>}
    </button>
  );
}
