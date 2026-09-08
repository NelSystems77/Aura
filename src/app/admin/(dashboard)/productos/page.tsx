import Link from "next/link";
import { listProducts, listBrands } from "@/lib/repo/products";
import type { Gender } from "@/lib/types";
import { BulkPriceForm } from "./BulkPriceForm";
import { ProductsTable } from "./ProductsTable";

const PAGE_SIZE = 30;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; gender?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || "";
  const gender = sp.gender === "hombre" || sp.gender === "mujer" ? (sp.gender as Gender) : undefined;
  const status = sp.status || "";
  const page = Math.max(1, Number(sp.page) || 1);

  const filters: Parameters<typeof listProducts>[0] = {};
  if (q) filters.q = q;
  if (gender) filters.gender = gender;
  if (status === "ofertas") filters.onOffer = true;
  if (status === "nuevos") filters.isNew = true;
  if (status === "agotados") filters.available = false;
  if (status === "destacados") filters.featured = true;

  const [all, brands] = await Promise.all([listProducts(filters), listBrands()]);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function buildQuery(overrides: Record<string, string | number>) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (gender) params.set("gender", gender);
    if (status) params.set("status", status);
    if (page > 1) params.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v === "" || v === undefined) params.delete(k);
      else params.set(k, String(v));
    }
    return `/admin/productos?${params.toString()}`;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Productos ({total})
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-[#c9a24b] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-black hover:brightness-110"
        >
          + Nuevo producto
        </Link>
      </div>

      <BulkPriceForm />

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o marca…"
          className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a24b]"
        />
        <select
          name="gender"
          defaultValue={gender || ""}
          className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="">Todos los géneros</option>
          <option value="hombre">Caballero</option>
          <option value="mujer">Dama</option>
        </select>
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="ofertas">En oferta</option>
          <option value="nuevos">Nuevos</option>
          <option value="agotados">Agotados</option>
          <option value="destacados">Destacados</option>
        </select>
        <button className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-[#c9a24b]">
          Filtrar
        </button>
        {(q || gender || status) && (
          <Link
            href="/admin/productos"
            className="rounded-lg px-4 py-2 text-sm text-white/40 hover:text-white"
          >
            Limpiar
          </Link>
        )}
      </form>

      <p className="mb-3 text-xs text-white/30">{brands.length} marcas en catálogo</p>

      <ProductsTable
        products={pageItems}
        allFilteredIds={all.map((p) => p.id)}
        allFilteredCount={total}
      />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-xs">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center gap-2">
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-white/30">…</span>}
                <Link
                  href={buildQuery({ page: p })}
                  className={`rounded-full px-3 py-1.5 ${
                    p === page ? "bg-[#c9a24b] text-black" : "border border-white/15 text-white/60"
                  }`}
                >
                  {p}
                </Link>
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
