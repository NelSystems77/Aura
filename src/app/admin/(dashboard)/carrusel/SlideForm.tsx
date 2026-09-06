"use client";

import { useActionState } from "react";
import { upsertSlideAction, type SlideFormState } from "@/lib/actions/carousel-actions";
import type { CarouselSlide } from "@/lib/types";

const initialState: SlideFormState = { error: null };
const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a24b]";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50";

export function SlideForm({ slide }: { slide?: CarouselSlide }) {
  const [state, formAction, pending] = useActionState(upsertSlideAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {slide && <input type="hidden" name="id" value={slide.id} />}

      <div>
        <label className={labelClass}>Título</label>
        <input name="title" required defaultValue={slide?.title} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Subtítulo</label>
        <input name="subtitle" defaultValue={slide?.subtitle} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>URL de imagen de fondo (opcional)</label>
        <input name="imageUrl" defaultValue={slide?.imageUrl ?? ""} placeholder="https://…" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Enlace al hacer clic</label>
          <input name="linkUrl" defaultValue={slide?.linkUrl ?? "/caballero"} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Texto del botón</label>
          <input name="ctaLabel" defaultValue={slide?.ctaLabel ?? "Ver más"} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tema visual</label>
          <select name="genderTheme" defaultValue={slide?.genderTheme ?? "general"} className={inputClass}>
            <option value="general">General</option>
            <option value="hombre">Caballero</option>
            <option value="mujer">Dama</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Orden</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={slide?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" name="active" defaultChecked={slide?.active ?? true} />
        Activa (visible en el inicio)
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#c9a24b] px-8 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Guardando…" : slide ? "Guardar cambios" : "Crear diapositiva"}
      </button>
    </form>
  );
}
