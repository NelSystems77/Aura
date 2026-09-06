import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel = "Ver todo",
  className = "",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div className={`mb-8 flex items-end justify-between gap-4 ${className}`}>
      <div>
        <p className="zone-accent-text text-xs font-bold uppercase tracking-[0.28em]">{eyebrow}</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="zone-accent-text hidden shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide sm:inline-flex"
        >
          {hrefLabel}
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
