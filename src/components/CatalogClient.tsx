"use client";

import { useMemo, useState } from "react";
import type { Product, Gender } from "@/lib/types";
import { ProductGrid } from "@/components/ProductGrid";
import { createProductSearchIndex, smartSearch } from "@/lib/search";

type SortOption = "recomendado" | "precio-asc" | "precio-desc" | "nombre";

const PAGE_SIZE = 20;

export function CatalogClient({
  products,
  brands,
  gender,
  whatsappNumber,
  siteUrl,
  forcedStatus,
}: {
  products: Product[];
  brands: string[];
  gender: Gender;
  whatsappNumber: string;
  siteUrl?: string;
  forcedStatus?: "ofertas" | "nuevos";
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<"todos" | "ofertas" | "nuevos">(forcedStatus ?? "todos");
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [sort, setSort] = useState<SortOption>("recomendado");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const index = useMemo(() => createProductSearchIndex(products), [products]);

  const filtered = useMemo(() => {
    let list = query.trim() ? smartSearch(products, index, query) : products;

    if (brand) list = list.filter((p) => p.brand === brand);
    if (status === "ofertas") list = list.filter((p) => p.onOffer);
    if (status === "nuevos") list = list.filter((p) => p.isNew);
    if (!includeOutOfStock) list = list.filter((p) => p.available);

    const sorted = [...list];
    if (sort === "precio-asc") sorted.sort((a, b) => a.currentPrice - b.currentPrice);
    else if (sort === "precio-desc") sorted.sort((a, b) => b.currentPrice - a.currentPrice);
    else if (sort === "nombre") sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [products, index, query, brand, status, includeOutOfStock, sort]);

  const visible = filtered.slice(0, visibleCount);
  const selectClasses =
    "rounded-full border zone-border zone-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-wide outline-none focus:zone-accent-text";

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder={gender === "hombre" ? "Buscar colonia o marca…" : "Buscar perfume o marca…"}
          className="w-full rounded-full border zone-border zone-surface px-4 py-2.5 text-sm outline-none placeholder:zone-muted-text sm:max-w-xs"
        />

        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className={selectClasses}
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {!forcedStatus && (
          <div className="flex gap-2">
            {(["todos", "ofertas", "nuevos"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  status === s
                    ? "bg-[var(--zone-accent)] text-black"
                    : "border zone-border zone-surface"
                }`}
              >
                {s === "todos" ? "Todos" : s === "ofertas" ? "Ofertas" : "Nuevos"}
              </button>
            ))}
          </div>
        )}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className={selectClasses}
        >
          <option value="recomendado">Recomendado</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>

        <label className="flex items-center gap-2 text-xs zone-muted-text">
          <input
            type="checkbox"
            checked={includeOutOfStock}
            onChange={(e) => {
              setIncludeOutOfStock(e.target.checked);
              setVisibleCount(PAGE_SIZE);
            }}
          />
          Mostrar agotados
        </label>
      </div>

      <p className="zone-muted-text mb-6 text-xs uppercase tracking-wide">
        {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
      </p>

      <ProductGrid products={visible} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />

      {visibleCount < filtered.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-full border zone-border px-8 py-3 text-xs font-bold uppercase tracking-[0.14em] zone-accent-text transition-colors hover:bg-[var(--zone-accent-soft)]"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}
