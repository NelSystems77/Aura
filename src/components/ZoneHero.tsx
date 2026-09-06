import type { ReactNode } from "react";

export function ZoneHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="luxury-grain relative overflow-hidden border-b zone-border py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 15% 20%, var(--zone-accent-soft) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <p className="zone-accent-text text-xs font-bold uppercase tracking-[0.3em]">{eyebrow}</p>
        <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="zone-muted-text mt-4 max-w-xl text-base">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
