"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ChevronDownIcon, MaxIcon, PhoneIcon, TelegramIcon } from "@/components/ui/icons";
import { NAV_LINKS, SERVICE_LINKS, getPrimaryCta } from "@/lib/nav";
import type { NavLink } from "@/lib/nav";
import type { SiteContacts } from "@/lib/contacts";

const navLinkClasses = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]"
      : "text-[var(--color-text-2)] hover:bg-[var(--color-bg-2)] hover:text-[var(--color-text)]"
  }`;

export function Header({ contacts }: { contacts: SiteContacts }) {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  const servicesRef = useRef<HTMLDivElement>(null);
  const cta = getPrimaryCta(pathname);
  const isServiceActive = SERVICE_LINKS.some((link) => link.href === pathname);

  // Закрываем меню при смене маршрута. Сброс состояния при смене пропса
  // выполняется прямо во время рендера (без setState в эффекте), как
  // рекомендует React, чтобы избежать лишнего каскадного ре-рендера.
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    if (menuOpen) setMenuOpen(false);
    if (servicesOpen) setServicesOpen(false);
  }

  // Блокируем прокрутку фона, пока полноэкранное меню открыто.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Выпадающее меню «Услуги» закрывается по Esc и по клику вне него.
  useEffect(() => {
    if (!servicesOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [servicesOpen]);

  const [privateLink, businessLink, portfolioLink] = NAV_LINKS;
  const desktopLink = (link: NavLink) => (
    <Link
      key={link.href}
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      className={navLinkClasses(pathname === link.href)}
    >
      {link.label}
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
            <BrandLogo />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
              {desktopLink(privateLink)}
              {desktopLink(businessLink)}
              <div ref={servicesRef} className="relative">
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="services-menu"
                  onClick={() => setServicesOpen((open) => !open)}
                  className={`inline-flex items-center gap-1 ${navLinkClasses(isServiceActive)}`}
                >
                  Услуги
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
                {servicesOpen && (
                  <div
                    id="services-menu"
                    className="absolute left-0 top-full mt-2 w-64 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-2 shadow-lg"
                  >
                    {SERVICE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={pathname === link.href ? "page" : undefined}
                        onClick={() => setServicesOpen(false)}
                        className={`block rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium ${
                          pathname === link.href
                            ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]"
                            : "text-[var(--color-text)] hover:bg-[var(--color-bg-2)]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {desktopLink(portfolioLink)}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              {contacts.phone && (
                <a
                  href={contacts.phone.href}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-2)]"
                  aria-label={`Позвонить: ${contacts.phone.label}${contacts.max ? "" : ". Этот номер есть в MAX"}`}
                >
                  <PhoneIcon className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="hidden flex-col leading-tight xl:flex">
                    {contacts.phone.label}
                    {/* Без ссылки на чат помечаем, что номер есть в MAX; со ссылкой рядом стоит значок MAX. */}
                    {!contacts.max && (
                      <span className="text-[11px] font-normal text-[var(--color-text-2)]">также в MAX</span>
                    )}
                  </span>
                </a>
              )}
              {contacts.telegram && (
                <a
                  href={contacts.telegram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Написать в Telegram: ${contacts.telegram.label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#229ED9] hover:bg-[var(--color-bg-2)]"
                >
                  <TelegramIcon className="h-5 w-5" />
                </a>
              )}
              {contacts.max && (
                <a
                  href={contacts.max.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Написать в MAX"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text)] hover:bg-[var(--color-bg-2)]"
                >
                  <MaxIcon className="h-5 w-5" />
                </a>
              )}
              <Button href={cta.href} size="md">
                {cta.label}
              </Button>
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text)] lg:hidden"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
        </Container>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col overflow-y-auto bg-[var(--color-bg-deep)] px-6 py-8 sm:top-20 lg:hidden"
        >
          <nav className="flex flex-col gap-5" aria-label="Мобильная навигация">
            {[privateLink, businessLink].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-medium text-[var(--color-text-inverse)]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div>
              <button
                type="button"
                aria-expanded={mobileServicesOpen}
                aria-controls="mobile-services"
                onClick={() => setMobileServicesOpen((open) => !open)}
                className="inline-flex items-center gap-2 text-2xl font-medium text-[var(--color-text-inverse)]"
              >
                Услуги
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileServicesOpen && (
                <div id="mobile-services" className="mt-3 flex flex-col gap-3 border-l border-white/20 pl-4">
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg text-[var(--color-text-inverse)]/85"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href={portfolioLink.href}
              className="text-2xl font-medium text-[var(--color-text-inverse)]"
              onClick={() => setMenuOpen(false)}
            >
              {portfolioLink.label}
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            {contacts.phone && (
              <a href={contacts.phone.href} className="inline-flex items-center gap-3 text-lg font-medium text-[var(--color-text-inverse)]">
                <PhoneIcon className="h-5 w-5 text-[var(--color-accent)]" />
                {contacts.phone.label}
              </a>
            )}
            {contacts.telegram && (
              <a
                href={contacts.telegram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-lg font-medium text-[var(--color-text-inverse)]"
              >
                <TelegramIcon className="h-5 w-5 text-[#229ED9]" />
                Telegram {contacts.telegram.label}
              </a>
            )}
            {contacts.max ? (
              <a
                href={contacts.max.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-lg font-medium text-[var(--color-text-inverse)]"
              >
                <MaxIcon className="h-5 w-5" />
                Написать в MAX
              </a>
            ) : (
              contacts.phone && (
                <p className="inline-flex items-center gap-3 text-base text-[var(--color-text-inverse)]/80">
                  <MaxIcon className="h-5 w-5" />
                  Этот номер есть в MAX
                </p>
              )
            )}
            <Button href={cta.href} size="lg" className="mt-2 w-full" onClick={() => setMenuOpen(false)}>
              {cta.label}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {open ? (
        <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <>
          <path d="M3 6H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 11H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 16H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
