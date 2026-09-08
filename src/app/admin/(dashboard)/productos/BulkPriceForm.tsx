"use client";

import { useActionState } from "react";
import { bulkAdjustPricesAction, type BulkPriceState } from "@/lib/actions/product-actions";

const initialState: BulkPriceState = { error: null };

export function BulkPriceForm() {
  const [state, formAction, pending] = useActionState(bulkAdjustPricesAction, initialState);

  return (
    <details className="mb-6 rounded-2xl border border-white/10 bg-[#111318] p-4">
      <summary className="cursor-pointer text-sm font-semibold text-white/80">
        💰 Ajuste masivo de precios
      </summary>

      <form
        action={formAction}
        onSubmit={(e) => {
          const amount = new FormData(e.currentTarget).get("amount");
          if (!confirm(`¿Aplicar ₡${amount} a TODOS los precios seleccionados? Esta acción no se puede deshacer con un clic.`)) {
            e.preventDefault();
          }
        }}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Monto en colones (usa - para restar)
          </label>
          <input
            name="amount"
            type="number"
            step="1"
            placeholder="5000"
            required
            className="w-40 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a24b]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Aplicar a
          </label>
          <select
            name="gender"
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">Todo el catálogo</option>
            <option value="hombre">Solo Caballero</option>
            <option value="mujer">Solo Dama</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#c9a24b] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-black hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Aplicando…" : "Aplicar a todos"}
        </button>
      </form>

      <p className="mt-3 text-xs text-white/40">
        Suma el monto al precio regular y al precio actual de cada producto (así se conserva el
        descuento en colones de los que están en oferta). Para bajar precios, usa un número
        negativo, ej. <code>-5000</code>.
      </p>

      {state.error && (
        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
          {state.success}
        </p>
      )}
    </details>
  );
}
