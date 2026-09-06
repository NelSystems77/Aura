"use client";

import { useTransition } from "react";
import { toggleProductFlagAction } from "@/lib/actions/product-actions";

export function ToggleButton({
  id,
  field,
  active,
  labelOn,
  labelOff,
}: {
  id: string;
  field: "onOffer" | "available" | "isNew" | "featured";
  active: boolean;
  labelOn: string;
  labelOff: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => toggleProductFlagAction(fd))}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <button
        type="submit"
        disabled={pending}
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50 ${
          active
            ? "bg-[#c9a24b] text-black"
            : "border border-white/15 text-white/50 hover:border-white/40"
        }`}
      >
        {active ? labelOn : labelOff}
      </button>
    </form>
  );
}
