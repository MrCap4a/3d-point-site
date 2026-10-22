"use client";

import { useCallback, useRef, useState } from "react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioModal } from "@/components/portfolio/PortfolioModal";
import type { PortfolioCaseData } from "@/lib/portfolio";

/**
 * Сетка карточек портфолио с модалкой. На мобиле две колонки, на
 * десктопе три. Один и тот же компонент на главной, /portfolio,
 * /private, /business и страницах услуг.
 */
export function PortfolioGrid({
  items,
  priorityCount = 0,
}: {
  items: PortfolioCaseData[];
  /** Сколько первых фото грузить с priority (видны на первом экране). */
  priorityCount?: number;
}) {
  const [selected, setSelected] = useState<PortfolioCaseData | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((item: PortfolioCaseData, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelected(item);
  }, []);

  // После закрытия фокус возвращается на карточку, с которой открыли окно.
  const close = useCallback(() => {
    setSelected(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3">
        {items.map((item, index) => (
          <PortfolioCard key={item.id} item={item} onOpen={open} priority={index < priorityCount} />
        ))}
      </div>

      {selected && <PortfolioModal item={selected} onClose={close} />}
    </>
  );
}
