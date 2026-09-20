"use client";

import { deleteProductAction } from "@/lib/actions/product-actions";

export function DeleteButton({ id, returnTo }: { id: string; returnTo?: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar este producto permanentemente?")) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      <button
        type="submit"
        className="rounded-full border border-red-500/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-400 hover:bg-red-500/10"
      >
        Eliminar
      </button>
    </form>
  );
}
