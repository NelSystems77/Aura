"use client";

import { useActionState } from "react";
import { upsertProductAction, type ProductFormState } from "@/lib/actions/product-actions";
import type { Product } from "@/lib/types";

const initialState: ProductFormState = { error: null };

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a24b]";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50";

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState(upsertProductAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nombre del producto</label>
          <input name="name" required defaultValue={product?.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Marca</label>
          <input name="brand" required defaultValue={product?.brand} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tamaño</label>
          <input name="size" defaultValue={product?.size ?? ""} placeholder="100ml" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Género</label>
          <select name="gender" defaultValue={product?.gender ?? "hombre"} className={inputClass}>
            <option value="hombre">Caballero</option>
            <option value="mujer">Dama</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Notas / familia olfativa (separadas por coma)</label>
          <input
            name="tags"
            defaultValue={product?.tags.join(", ") ?? ""}
            placeholder="Dulce, Amaderado"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Precio regular (₡)</label>
          <input
            name="regularPrice"
            type="number"
            min={0}
            required
            defaultValue={product?.regularPrice}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Precio actual (₡)</label>
          <input
            name="currentPrice"
            type="number"
            min={0}
            defaultValue={product?.currentPrice}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>URL de imagen (opcional)</label>
          <input
            name="imageUrl"
            defaultValue={product?.imageUrl ?? ""}
            placeholder="https://…"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Descripción (opcional)</label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            rows={3}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          { name: "onOffer", label: "En oferta", checked: product?.onOffer },
          { name: "available", label: "Disponible", checked: product?.available ?? true },
          { name: "isNew", label: "Nuevo ingreso", checked: product?.isNew },
          { name: "featured", label: "Destacado", checked: product?.featured },
        ].map((f) => (
          <label key={f.name} className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" name={f.name} defaultChecked={f.checked} />
            {f.label}
          </label>
        ))}
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#c9a24b] px-8 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}
