"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatColones } from "@/lib/format";
import { ToggleButton } from "./ToggleButton";
import { DeleteButton } from "./DeleteButton";
import {
  bulkAvailabilitySelectedAction,
  bulkDiscountSelectedAction,
} from "@/lib/actions/product-actions";

const DISCOUNT_PRESETS = [10, 15, 20, 30, 40, 50];

export function ProductsTable({
  products,
  allFilteredIds,
  allFilteredCount,
}: {
  products: Product[];
  allFilteredIds: string[];
  allFilteredCount: number;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const pageIds = useMemo(() => products.map((p) => p.id), [products]);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function selectAllFiltered() {
    setSelected(new Set(allFilteredIds));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function runDiscount(percent: number | null) {
    const ids = Array.from(selected);
    const label = percent === null ? "quitar la oferta de" : `aplicar ${percent}% de descuento a`;
    if (!confirm(`¿Seguro que quieres ${label} ${ids.length} producto(s)?`)) return;

    startTransition(async () => {
      const result = await bulkDiscountSelectedAction(ids, percent);
      setMessage(
        result.error ? { type: "error", text: result.error } : { type: "ok", text: result.success! }
      );
    });
  }

  function runAvailability(available: boolean) {
    const ids = Array.from(selected);
    const label = available ? "disponibles" : "agotados";
    if (!confirm(`¿Marcar ${ids.length} producto(s) como ${label}?`)) return;

    startTransition(async () => {
      const result = await bulkAvailabilitySelectedAction(ids, available);
      setMessage(
        result.error ? { type: "error", text: result.error } : { type: "ok", text: result.success! }
      );
    });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-white/50">
        <span>{selected.size} seleccionado(s)</span>
        {allFilteredCount > pageIds.length && (
          <button
            onClick={selectAllFiltered}
            className="text-[#c9a24b] hover:underline"
          >
            Seleccionar los {allFilteredCount} resultados filtrados
          </button>
        )}
        {selected.size > 0 && (
          <button onClick={clearSelection} className="hover:text-white">
            Limpiar selección
          </button>
        )}
      </div>

      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[#c9a24b]/30 bg-[#c9a24b]/10 p-4">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-white/70">
            Aplicar a {selected.size} producto(s):
          </span>

          {DISCOUNT_PRESETS.map((pct) => (
            <button
              key={pct}
              disabled={pending}
              onClick={() => runDiscount(pct)}
              className="rounded-full bg-[#c9a24b] px-3 py-1.5 text-xs font-bold text-black hover:brightness-110 disabled:opacity-50"
            >
              -{pct}%
            </button>
          ))}
          <button
            disabled={pending}
            onClick={() => runDiscount(null)}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:border-white/50 disabled:opacity-50"
          >
            Quitar oferta
          </button>

          <span className="mx-2 h-4 w-px bg-white/15" />

          <button
            disabled={pending}
            onClick={() => runAvailability(false)}
            className="rounded-full border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50"
          >
            Marcar agotado
          </button>
          <button
            disabled={pending}
            onClick={() => runAvailability(true)}
            className="rounded-full border border-emerald-400/40 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50"
          >
            Marcar disponible
          </button>
        </div>
      )}

      {message && (
        <p
          className={`mb-4 rounded-lg px-3 py-2 text-xs ${
            message.type === "ok"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-[#111318] text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleAllOnPage}
                  aria-label="Seleccionar todos en esta página"
                />
              </th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Género</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Oferta</th>
              <th className="px-4 py-3">Disponible</th>
              <th className="px-4 py-3">Nuevo</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className={`hover:bg-white/[0.03] ${selected.has(p.id) ? "bg-white/[0.04]" : ""}`}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleOne(p.id)}
                    aria-label={`Seleccionar ${p.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-xs text-white/40">{p.brand}</p>
                </td>
                <td className="px-4 py-3 text-xs uppercase text-white/60">
                  {p.gender === "hombre" ? "Caballero" : "Dama"}
                </td>
                <td className="px-4 py-3 text-xs text-white/70">
                  {formatColones(p.currentPrice)}
                  {p.onOffer && (
                    <span className="ml-1 text-white/30 line-through">
                      {formatColones(p.regularPrice)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ToggleButton id={p.id} field="onOffer" active={p.onOffer} labelOn="Sí" labelOff="No" />
                </td>
                <td className="px-4 py-3">
                  <ToggleButton
                    id={p.id}
                    field="available"
                    active={p.available}
                    labelOn="Sí"
                    labelOff="Agotado"
                  />
                </td>
                <td className="px-4 py-3">
                  <ToggleButton id={p.id} field="isNew" active={p.isNew} labelOn="Sí" labelOff="No" />
                </td>
                <td className="px-4 py-3">
                  <ToggleButton
                    id={p.id}
                    field="featured"
                    active={p.featured}
                    labelOn="Sí"
                    labelOff="No"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/70 hover:border-[#c9a24b] hover:text-[#c9a24b]"
                    >
                      Editar
                    </Link>
                    <DeleteButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
