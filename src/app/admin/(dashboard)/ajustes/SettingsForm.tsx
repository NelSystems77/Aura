"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsFormState } from "@/lib/actions/settings-actions";
import type { SiteSettings } from "@/lib/types";

const initialState: SettingsFormState = { error: null };
const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a24b]";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nombre del sitio</label>
          <input name="siteName" defaultValue={settings.siteName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Número de WhatsApp principal (código país + número)</label>
          <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className={inputClass} />
          <p className="mt-1 text-[11px] text-white/30">
            Usado en el botón flotante, "Comprar por WhatsApp" y todos los enlaces de venta.
          </p>
        </div>
        <div>
          <label className={labelClass}>
            Número de WhatsApp secundario (opcional, solo se muestra en el pie de página)
          </label>
          <input
            name="whatsappNumberSecondary"
            defaultValue={settings.whatsappNumberSecondary}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Eslogan</label>
          <input name="siteTagline" defaultValue={settings.siteTagline} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Descripción SEO (meta description)</label>
          <textarea name="seoDescription" defaultValue={settings.seoDescription} rows={2} className={inputClass} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#c9a24b]">Zona Caballero</p>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Título del hero</label>
            <input name="heroTitleHombre" defaultValue={settings.heroTitleHombre} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subtítulo del hero</label>
            <input name="heroSubtitleHombre" defaultValue={settings.heroSubtitleHombre} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#93283a]">Zona Dama</p>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Título del hero</label>
            <input name="heroTitleMujer" defaultValue={settings.heroTitleMujer} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subtítulo del hero</label>
            <input name="heroSubtitleMujer" defaultValue={settings.heroSubtitleMujer} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Instagram (URL, opcional)</label>
          <input name="instagramUrl" defaultValue={settings.instagramUrl} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Facebook (URL, opcional)</label>
          <input name="facebookUrl" defaultValue={settings.facebookUrl} className={inputClass} />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
          Ajustes guardados correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#c9a24b] px-8 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar ajustes"}
      </button>
    </form>
  );
}
