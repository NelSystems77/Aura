import type { Gender } from "@/lib/types";

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const FAMILY_PATTERNS: Record<string, string> = {
  Dulce: "dots",
  Floral: "petals",
  Citrico: "dots",
  "Fresco / Acuatico": "waves",
  Amaderado: "lines",
  Especiado: "lines",
  "Nocturno / Intenso": "none",
};

type Props = {
  slug: string;
  brand: string;
  gender: Gender;
  tags: string[];
  className?: string;
};

export function ProductVisual({ slug, brand, gender, tags, className }: Props) {
  const seed = hashString(slug);
  const variant = seed % 4;
  const pattern = FAMILY_PATTERNS[tags[0] ?? ""] ?? "none";
  const initial = brand.trim().charAt(0).toUpperCase() || "A";

  const isHombre = gender === "hombre";
  const accent = isHombre ? "#c9a24b" : "#93283a";
  const accent2 = isHombre ? "#3d5a73" : "#caa46a";
  const glassTop = isHombre ? "#2a2f38" : "#fdf6f3";
  const glassBottom = isHombre ? "#12151a" : "#f3d9d4";
  const liquidColor = isHombre ? accent : accent2;
  const gradId = `bottle-grad-${slug}`;
  const liquidId = `liquid-grad-${slug}`;
  const glowId = `glow-${slug}`;

  const bodyWidth = [64, 76, 58, 68][variant];
  const bodyHeight = [120, 104, 132, 140][variant];
  const bodyRadius = [16, 34, 6, 20][variant];
  const neckHeight = [22, 16, 26, 30][variant];
  const capHeight = [18, 22, 16, 14][variant];
  const capShape = variant === 2 ? "polygon" : "rounded";

  const cx = 100;
  const bodyTop = 200 - bodyHeight;
  const neckTop = bodyTop - neckHeight;
  const capTop = neckTop - capHeight;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{
        background: isHombre
          ? "radial-gradient(120% 120% at 30% 15%, #1c2129 0%, #0b0d10 70%)"
          : "radial-gradient(120% 120% at 30% 15%, #ffffff 0%, #fbf1ee 70%)",
      }}
      aria-hidden="true"
    >
      {pattern === "dots" && (
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `radial-gradient(${accent} 1px, transparent 1.5px)`,
            backgroundSize: "16px 16px",
          }}
        />
      )}
      {pattern === "lines" && (
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `repeating-linear-gradient(115deg, ${accent} 0 1px, transparent 1px 14px)`,
          }}
        />
      )}
      {pattern === "waves" && (
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 50% 120%, transparent 0 10px, ${accent2} 11px 12px)`,
          }}
        />
      )}
      {pattern === "petals" && (
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${accent} 0 10px, transparent 11px), radial-gradient(circle at 80% 65%, ${accent2} 0 12px, transparent 13px)`,
          }}
        />
      )}

      <svg
        viewBox="0 0 200 220"
        className="relative z-[2] h-[62%] w-auto drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={glassTop} stopOpacity="0.95" />
            <stop offset="100%" stopColor={glassBottom} stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id={liquidId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={liquidColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={cx} cy={210} rx={bodyWidth * 0.85} ry={8} fill="black" opacity="0.25" />
        <circle cx={cx} cy={bodyTop + bodyHeight * 0.3} r={bodyWidth * 1.6} fill={`url(#${glowId})`} />

        {capShape === "polygon" ? (
          <polygon
            points={`${cx - 14},${capTop + capHeight} ${cx - 10},${capTop} ${cx + 10},${capTop} ${cx + 14},${capTop + capHeight}`}
            fill={accent}
          />
        ) : (
          <rect
            x={cx - 13}
            y={capTop}
            width={26}
            height={capHeight}
            rx={variant === 1 ? 13 : 5}
            fill={accent}
          />
        )}

        <rect x={cx - 7} y={neckTop} width={14} height={neckHeight} fill={`url(#${gradId})`} stroke={accent} strokeOpacity="0.4" />

        {variant === 2 ? (
          <polygon
            points={`${cx},${bodyTop} ${cx + bodyWidth / 2},${bodyTop + bodyHeight * 0.18} ${cx + bodyWidth / 2},${bodyTop + bodyHeight} ${cx - bodyWidth / 2},${bodyTop + bodyHeight} ${cx - bodyWidth / 2},${bodyTop + bodyHeight * 0.18}`}
            fill={`url(#${gradId})`}
            stroke={accent}
            strokeOpacity="0.35"
          />
        ) : (
          <rect
            x={cx - bodyWidth / 2}
            y={bodyTop}
            width={bodyWidth}
            height={bodyHeight}
            rx={bodyRadius}
            fill={`url(#${gradId})`}
            stroke={accent}
            strokeOpacity="0.35"
          />
        )}

        <rect
          x={cx - bodyWidth / 2 + 4}
          y={bodyTop + bodyHeight * 0.32}
          width={bodyWidth - 8}
          height={bodyHeight * 0.6}
          rx={bodyRadius * 0.6}
          fill={`url(#${liquidId})`}
        />

        <rect
          x={cx - bodyWidth / 2 + 6}
          y={bodyTop + 6}
          width={6}
          height={bodyHeight - 12}
          rx={3}
          fill="white"
          opacity="0.18"
        />

        <circle cx={cx} cy={bodyTop + bodyHeight * 0.55} r={13} fill={isHombre ? "#0b0d10" : "#fffbf9"} stroke={accent} strokeWidth="1.2" />
        <text
          x={cx}
          y={bodyTop + bodyHeight * 0.55 + 5}
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--font-display, serif)"
          fill={accent}
        >
          {initial}
        </text>
      </svg>
    </div>
  );
}
