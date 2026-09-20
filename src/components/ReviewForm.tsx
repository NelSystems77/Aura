"use client";

import { useActionState, useState } from "react";
import { submitReviewAction, type ReviewFormState } from "@/lib/actions/review-actions";
import { StarRatingInput } from "@/components/StarRating";

const initialState: ReviewFormState = { error: null };

export function ReviewForm() {
  const [state, formAction, pending] = useActionState(submitReviewAction, initialState);
  const [rating, setRating] = useState(5);

  if (state.success) {
    return (
      <div className="rounded-2xl border zone-border zone-surface p-6 text-center">
        <p className="text-2xl">🙏</p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold">
          ¡Gracias por tu reseña!
        </p>
        <p className="zone-muted-text mt-1 text-sm">
          La revisaremos y en breve aparecerá publicada en el sitio.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border zone-border zone-surface p-6">
      {/* Campo señuelo anti-spam: oculto para personas, visible para bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide zone-muted-text">
          Tu nombre
        </label>
        <input
          name="customerName"
          required
          maxLength={80}
          className="w-full rounded-lg border zone-border zone-surface-2 px-3 py-2.5 text-sm outline-none focus:zone-accent-text"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide zone-muted-text">
          Calificación
        </label>
        <input type="hidden" name="rating" value={rating} />
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide zone-muted-text">
          Tu experiencia con AURA
        </label>
        <textarea
          name="comment"
          required
          minLength={10}
          maxLength={800}
          rows={4}
          placeholder="Cuéntanos sobre el producto, la entrega, la atención…"
          className="w-full rounded-lg border zone-border zone-surface-2 px-3 py-2.5 text-sm outline-none focus:zone-accent-text"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--zone-accent,#c9a24b)] py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition-transform hover:brightness-110 active:scale-95 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}
