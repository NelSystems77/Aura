"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { formatColones, formatDiscountPercent } from "@/lib/format";

type SearchResult = {
  slug: string;
  name: string;
  brand: string;
  gender: "hombre" | "mujer";
  currentPrice: number;
  regularPrice: number;
  available: boolean;
  onOffer: boolean;
};

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 backdrop-blur-sm px-4 pt-20 sm:pt-28"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111318] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none fill-none stroke-[#c9a24b] stroke-2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: algo dulce para la noche, Armaf, Club de Nuit…"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none sm:text-base"
              />
              <button
                onClick={onClose}
                aria-label="Cerrar búsqueda"
                className="flex-none text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <p className="px-5 py-6 text-center text-sm text-white/40">Buscando…</p>
              )}
              {!loading && query && results.length === 0 && (
                <p className="px-5 py-6 text-center text-sm text-white/40">
                  Sin resultados para “{query}”. Prueba con una marca o una nota olfativa.
                </p>
              )}
              {!loading &&
                results.map((r) => {
                  const discount = formatDiscountPercent(r.regularPrice, r.currentPrice);
                  return (
                    <Link
                      key={r.slug}
                      href={`/producto/${r.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-white/5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{r.name}</p>
                        <p className="text-xs uppercase tracking-wide text-white/40">
                          {r.brand} · {r.gender === "hombre" ? "Caballero" : "Dama"}
                          {!r.available && " · Agotado"}
                        </p>
                      </div>
                      <div className="flex-none text-right">
                        <p className="text-sm font-bold text-[#c9a24b]">
                          {formatColones(r.currentPrice)}
                        </p>
                        {discount > 0 && (
                          <p className="text-[11px] text-white/40 line-through">
                            {formatColones(r.regularPrice)}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              {!query && (
                <div className="px-5 py-6 text-xs text-white/40">
                  <p className="mb-2 font-semibold uppercase tracking-wide text-white/60">
                    Prueba buscar por:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "amaderado intenso",
                      "floral fresco",
                      "para la oficina",
                      "para una cita",
                      "Armaf",
                      "Lattafa",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="rounded-full border border-white/15 px-3 py-1 hover:border-[#c9a24b] hover:text-[#c9a24b]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
