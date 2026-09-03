import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND, NAV_LINKS } from "@/lib/nav";
import { COMPANY } from "@/lib/company";

/**
 * Отдельной страницы "Контакты" в архитектуре сайта нет — её функцию
 * частично закрывает футер: телефон, Telegram и юридические реквизиты ИП.
 * Значения берутся из @/lib/company (единый источник правды).
 */
export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-deep)] text-[var(--color-text-inverse)]">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-baseline gap-2 text-lg font-semibold tracking-[-0.01em]"
              aria-label="3Dpoint / 3Дточка — на главную"
            >
              <span>{BRAND.en}</span>
              <span className="text-[var(--color-accent)]" aria-hidden="true">
                /
              </span>
              <span>{BRAND.ru}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-text-inverse)]/70">
              Изготавливаем и восстанавливаем пластиковые детали под ключ.
              Покажите проблему — решение возьмём на себя и доведём до
              результата.
            </p>
            <div className="mt-6">
              <Button href="/#request-form" variant="primary" size="md">
                Рассказать о задаче
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-text-inverse)]/50">
              Разделы
            </p>
            <nav className="mt-4 flex flex-col gap-3" aria-label="Ссылки в футере">
              <Link href="/" className="text-sm text-[var(--color-text-inverse)]/80 hover:text-[var(--color-text-inverse)]">
                Главная
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--color-text-inverse)]/80 hover:text-[var(--color-text-inverse)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-text-inverse)]/50">
              Контакты
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <a
                href={`tel:${COMPANY.phone.href}`}
                className="text-[var(--color-text-inverse)]/80 hover:text-[var(--color-text-inverse)]"
              >
                {COMPANY.phone.display}
              </a>
              <a
                href={COMPANY.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-inverse)]/80 hover:text-[var(--color-text-inverse)]"
              >
                Telegram: {COMPANY.telegram.handle}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-white/10 pt-6 text-xs text-[var(--color-text-inverse)]/50">
          <p>
            {COMPANY.legalName}, ИНН {COMPANY.inn}
          </p>
          <p>
            © {new Date().getFullYear()} {BRAND.en} / {BRAND.ru}. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
}
