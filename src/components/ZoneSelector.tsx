"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ZONES = [
  {
    href: "/caballero",
    label: "Zona Caballero",
    tagline: "Poder, carácter y presencia",
    font: "var(--font-cinzel)",
    bg: "linear-gradient(160deg,#0b0d10 0%,#1c2129 55%,#2c3542 100%)",
    accent: "#c9a24b",
  },
  {
    href: "/dama",
    label: "Zona Dama",
    tagline: "Sensualidad, elegancia y calidez",
    font: "var(--font-garamond)",
    bg: "linear-gradient(160deg,#3a1420 0%,#6e1423 55%,#93283a 100%)",
    accent: "#e9c9b8",
  },
];

export function ZoneSelector() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {ZONES.map((zone, i) => (
        <motion.div
          key={zone.href}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
        >
          <Link
            href={zone.href}
            className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl p-8 shadow-xl transition-transform duration-500 hover:scale-[1.015] sm:h-96"
            style={{ background: zone.bg }}
          >
            <div className="luxury-grain absolute inset-0 opacity-60" />
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(60% 60% at 70% 20%, ${zone.accent}33 0%, transparent 70%)`,
              }}
            />
            <p
              className="relative z-10 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: zone.accent }}
            >
              Explorar
            </p>
            <h3
              className="relative z-10 mt-2 text-3xl font-bold tracking-wide text-white sm:text-4xl"
              style={{ fontFamily: zone.font }}
            >
              {zone.label}
            </h3>
            <p className="relative z-10 mt-2 text-sm text-white/70">{zone.tagline}</p>
            <span
              className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-1"
            >
              Ver colección
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
