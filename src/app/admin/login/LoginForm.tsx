"use client";

import { useState, useTransition } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase-client";
import { createSessionAction } from "@/lib/actions/auth-actions";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    startTransition(async () => {
      let idToken: string;
      try {
        const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
        idToken = await credential.user.getIdToken();
      } catch {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      const result = await createSessionAction(idToken, nextPath);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
          Correo
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a24b]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
          Contraseña
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a24b]"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#c9a24b] py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition-transform hover:brightness-110 active:scale-95 disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
