"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { imageUrl, type PortfolioCaseData } from "@/lib/portfolio";
import { reachGoal } from "@/lib/metrika";
import { prefillRequestForm } from "@/lib/request-form";

type PortfolioModalProps = {
  item: PortfolioCaseData;
  onClose: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Модальное окно кейса: фото «до» и «после» (если есть фото «до»), полное
 * описание, материал, срок, цена и кнопка «Нужно похожее». Закрывается по
 * Esc и клику по фону; фокус удерживается внутри окна.
 */
export function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const after = item.images[0];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Tab и Shift+Tab ходят по кругу внутри окна.
  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function orderSimilar() {
    reachGoal("portfolio_cta");
    onClose();
    prefillRequestForm(`Похоже на работу: ${item.title}. `);
  }

  const facts = [
    { label: "Материал", value: item.material },
    { label: "Срок", value: item.leadTime },
    { label: "Цена", value: item.price },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-modal-title"
        onKeyDown={trapFocus}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[var(--radius-md)] bg-[var(--color-bg)] sm:rounded-[var(--radius-md)]"
        onClick={(event) => event.stopPropagation()}
      >
        {item.beforeImage && after ? (
          <div className="grid grid-cols-2 gap-1 bg-[var(--color-bg-2)]">
            <ModalImage id={item.beforeImage.id} alt={`${item.title} — до`} label="До" />
            <ModalImage id={after.id} alt={`${item.title} — после`} label="После" />
          </div>
        ) : after ? (
          <ModalImage id={after.id} alt={item.title} wide />
        ) : (
          <PlaceholderImage className="aspect-[16/9] w-full" />
        )}

        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 id="portfolio-modal-title" className="text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
              {item.title}
            </h3>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="-mr-2 -mt-1 shrink-0 rounded-[var(--radius-sm)] p-2 text-[var(--color-text-2)] hover:bg-[var(--color-bg-2)]"
            >
              ✕
            </button>
          </div>

          {facts.length > 0 && (
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {facts.map((fact) => (
                <div key={fact.label} className="flex gap-1.5">
                  <dt className="text-[var(--color-text-2)]">{fact.label}:</dt>
                  <dd className="font-medium text-[var(--color-text)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-2)] sm:text-base">
            {item.description}
          </p>

          <div className="mt-6">
            <Button type="button" size="lg" className="w-full sm:w-auto" onClick={orderSimilar}>
              Нужно похожее
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalImage({ id, alt, label, wide = false }: { id: string; alt: string; label?: string; wide?: boolean }) {
  return (
    <div className={`relative w-full ${wide ? "aspect-[16/9]" : "aspect-square"}`}>
      <Image
        src={imageUrl(id)}
        alt={alt}
        fill
        sizes={wide ? "(min-width: 768px) 768px, 100vw" : "(min-width: 768px) 384px, 50vw"}
        className="object-cover"
      />
      {label && (
        <span className="absolute left-2 top-2 rounded-[var(--radius-sm)] bg-black/70 px-2 py-1 text-xs font-medium text-white">
          {label}
        </span>
      )}
    </div>
  );
}
