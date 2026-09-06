"use client";

import { useActionState } from "react";
import { updatePasswordAction, type PasswordFormState } from "@/lib/actions/settings-actions";

const initialState: PasswordFormState = { error: null };
const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a24b]";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label className={labelClass}>Nueva contraseña</label>
        <input name="newPassword" type="password" required minLength={8} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Confirmar nueva contraseña</label>
        <input name="confirmPassword" type="password" required minLength={8} className={inputClass} />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
          Contraseña actualizada.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-white/20 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:border-[#c9a24b] hover:text-[#c9a24b] disabled:opacity-60"
      >
        {pending ? "Actualizando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
