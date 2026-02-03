"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

type NavLabels = {
  home: string;
  privacy: string;
  terms: string;
  contact: string;
  tips: string;
};

type HeaderProps = {
  locale: string;
  brand: string;
  nav: NavLabels;
  cta: string;
};

const buildLocalePath = (pathname: string, targetLocale: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.length > 0 ? segments.slice(1).join("/") : "";
  return `/${targetLocale}${rest ? `/${rest}` : ""}`;
};

export default function Header({ locale, brand, nav, cta }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0] ?? locale;

  const navItems = useMemo(
    () => [
      { href: `/${locale}`, label: nav.home },
      { href: `/${locale}/privacy`, label: nav.privacy },
      { href: `/${locale}/terms`, label: nav.terms },
      { href: `/${locale}/contact`, label: nav.contact },
    ],
    [locale, nav]
  );
  const tipsItem = useMemo(
    () => ({ href: `/${locale}/tips`, label: nav.tips }),
    [locale, nav]
  );

  const localeLinks = [
    { code: "en", label: "EN" },
    { code: "et", label: "ET" },
  ];

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const mobileMenu =
    open && portalRoot
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 w-screen h-screen bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
            />
            <div className="fixed top-0 right-0 h-screen w-[80vw] max-w-sm bg-emerald-950 z-50 px-6 pb-12 pt-24 text-white shadow-2xl md:hidden">
              <button
                type="button"
                aria-label="Close menu"
                className="absolute top-4 right-4 p-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                onClick={closeMenu}
              >
                <X size={20} />
              </button>
              <nav className="flex flex-col gap-6 text-xl font-semibold">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition-colors hover:text-emerald-200"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {localeLinks.map((item) => {
                  const active = currentLocale === item.code;
                  return (
                    <Link
                      key={item.code}
                      href={buildLocalePath(pathname, item.code)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-white bg-white text-emerald-950"
                          : "border-white/30 text-white"
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-col items-start gap-3">
                <Link
                  href={tipsItem.href}
                  className="inline-flex w-fit items-center rounded-full border border-white/30 px-5 py-3 text-base font-semibold text-white transition hover:border-white"
                  onClick={closeMenu}
                >
                  {tipsItem.label}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex w-fit items-center rounded-full bg-white px-5 py-3 text-base font-semibold text-emerald-950 shadow-sm"
                  onClick={closeMenu}
                >
                  {cta}
                </Link>
              </div>
            </div>
          </>,
          portalRoot
        )
      : null;

  return (
    <>
      <header
        className={`sticky top-0 border-b border-white/10 bg-emerald-950/70 backdrop-blur ${
          open ? "z-30" : "z-50"
        }`}
      >
        <div className="relative z-50 mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-white"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1">
              <Image
                src="/icon.png"
                alt={`${brand} logo`}
                width={28}
                height={28}
                className="h-7 w-7 object-contain brightness-75 contrast-110"
                priority
              />
            </span>
            <span className="text-lg font-semibold tracking-tight">{brand}</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            {navItems.map((item) => {
              const isHome = item.href === `/${locale}`;
              const active = isHome
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    active ? "text-white" : "hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-xs font-semibold text-white/70">
              {localeLinks.map((item) => {
                const active = currentLocale === item.code;
                return (
                  <Link
                    key={item.code}
                    href={buildLocalePath(pathname, item.code)}
                    className={`rounded-full px-2 py-1 transition-colors ${
                      active ? "bg-white text-emerald-950" : "hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Link
              href={tipsItem.href}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/10"
            >
              {tipsItem.label}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100"
            >
              {cta}
            </Link>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 text-white md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
