import type { ReactNode } from "react";

export const inputClasses =
  "w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent px-4 py-3 text-base text-[var(--color-text)] outline-none transition-shadow focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/25 placeholder:text-[var(--color-text-3)] sm:text-sm";

/**
 * Поле формы с подписью. Обязательные поля помечены звёздочкой, подсказка
 * связана с полем через aria-describedby.
 */
export function Field({
  label,
  htmlFor,
  hint,
  required = false,
  optional = false,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required && (
          <span className="text-[var(--color-accent-text)]" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {optional && <span className="font-normal text-[var(--color-text-2)]"> (необязательно)</span>}
      </label>
      {children}
      {hint && (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs text-[var(--color-text-2)]">
          {hint}
        </p>
      )}
    </div>
  );
}
