import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { MetrikaNotFoundInit } from "@/components/analytics/MetrikaNotFoundInit";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-3)]">
        Ошибка 404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
        Страница не найдена
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-2)]">
        Возможно, страница была перемещена или адрес введён с ошибкой.
        Вернитесь на главную или расскажите нам о своей задаче.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/">На главную</Button>
        <Button href="/#request-form" variant="secondary">
          Рассказать о задаче
        </Button>
      </div>
      <MetrikaNotFoundInit />
    </div>
  );
}
