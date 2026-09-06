import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  solid:
    "bg-[var(--zone-accent,#c9a24b)] text-black hover:brightness-110 shadow-[0_10px_30px_-10px_var(--zone-accent,#c9a24b)]",
  outline:
    "border border-[var(--zone-accent,#c9a24b)] text-[var(--zone-accent,#c9a24b)] hover:bg-[var(--zone-accent-soft,rgba(201,162,75,0.12))]",
  ghost: "text-current hover:opacity-70",
  whatsapp: "bg-[#25D366] text-white hover:brightness-105 shadow-[0_10px_30px_-10px_#25D366]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.08em] transition-all duration-300 ease-out active:scale-95";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  children,
  variant = "solid",
  size = "md",
  className = "",
  href,
  ...rest
}: CommonProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
