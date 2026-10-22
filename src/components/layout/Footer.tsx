import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND, LEGAL_LINKS, NAV_LINKS, SERVICE_LINKS } from "@/lib/nav";
import type { NavLink } from "@/lib/nav";
import { COMPANY } from "@/lib/company";
import type { SiteContacts } from "@/lib/contacts";

const linkClasses =
  "text-sm text-[var(--color-text-inverse)]/80 hover:text-[var(--color-text-inverse)]";

/**
 * Отдельной страницы "Контакты" в архитектуре сайта нет — её функцию
 * частично закрывает футер: телефон, Telegram и юридические реквизиты ИП.
 * Телефон и Telegram задаются в разделе "Настройки" админки, при пустом
 * поле — значение из @/lib/company (см. getSiteContacts). Реквизиты ИП —
 * всегда из @/lib/company.
 */
export function Footer({ contacts }: { contacts: SiteContacts }) {
  return (
    <footer className="bg-[var(--color-bg-deep)] text-[var(--color-text-inverse)]">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-12">
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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-text-inverse)]/75">
              Изготавливаем и восстанавливаем пластиковые детали под ключ:
              3D-печать, 3D-сканирование и моделирование.
            </p>
            <div className="mt-6">
              <Button href="/#request-form" variant="primary" size="md">
                Оставить заявку
              </Button>
            </div>
          </div>

          <FooterColumn title="Разделы" links={[{ href: "/", label: "Главная" }, ...NAV_LINKS]} />
          <FooterColumn title="Услуги" links={SERVICE_LINKS} />

          <div>
            <FooterHeading>Контакты</FooterHeading>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {contacts.phone && (
                <a href={contacts.phone.href} className={linkClasses}>
                  {contacts.phone.label}
                </a>
              )}
              {contacts.telegram && (
                <a
                  href={contacts.telegram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  Telegram: {contacts.telegram.label}
                </a>
              )}
              <p className="leading-relaxed text-[var(--color-text-inverse)]/75">{COMPANY.region}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[var(--color-text-inverse)]/70 sm:mt-12">
          <nav className="flex flex-col gap-2 sm:flex-row sm:gap-6" aria-label="Правовая информация">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[var(--color-text-inverse)]">
                {link.label}
              </Link>
            ))}
          </nav>
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

function FooterHeading({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-text-inverse)]/65">
      {children}
    </p>
  );
}

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <nav className="mt-4 flex flex-col gap-3" aria-label={title}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClasses}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
