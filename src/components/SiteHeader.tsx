"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchOverlay } from "@/components/SearchOverlay";

const NAV_LINKS = [
  { href: "/caballero", label: "Caballero" },
  { href: "/dama", label: "Dama" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/nuevos-ingresos", label: "Nuevos Ingresos" },
];

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d10]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-[family-name:var(--font-cinzel)] text-xl font-semibold tracking-[0.28em] text-[#f2efe9]"
          >
            AURA
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-[#c9a24b]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#c9a24b] hover:text-[#c9a24b]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menú"
              className="flex h-9 w-9 items-center justify-center text-white/80 md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col border-t border-white/10 bg-[#0b0d10] px-5 py-3 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/5 py-3 text-sm font-semibold uppercase tracking-wide text-white/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
