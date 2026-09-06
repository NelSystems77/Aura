import type { ReactNode } from "react";

type Tone = "gold" | "danger" | "muted" | "success";

const TONE_CLASSES: Record<Tone, string> = {
  gold: "bg-[var(--zone-accent,#c9a24b)] text-black",
  danger: "bg-red-600 text-white",
  muted: "bg-black/50 text-white backdrop-blur-sm",
  success: "bg-emerald-600 text-white",
};

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
