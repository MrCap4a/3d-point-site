import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type CalloutProps = {
  children: ReactNode;
};

/**
 * Акцентная цитата-принцип на всю ширину секции (тёмный фон, как футер) —
 * используется для ключевых человеческих формулировок вроде объяснения
 * приоритета бизнес-заказов, чтобы выделить мысль без пафосного корпоративного
 * оформления.
 */
export function Callout({ children }: CalloutProps) {
  return (
    <section className="bg-[var(--color-bg-deep)] py-11 sm:py-20">
      <Container>
        <p className="mx-auto max-w-3xl text-center text-xl font-medium leading-relaxed tracking-[-0.01em] text-[var(--color-text-inverse)] sm:text-2xl">
          {children}
        </p>
      </Container>
    </section>
  );
}
