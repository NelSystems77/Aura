"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { CarouselSlide } from "@/lib/types";

const THEME_STYLES: Record<string, { bg: string; accent: string }> = {
  hombre: { bg: "linear-gradient(120deg,#0b0d10 0%,#1c2129 60%,#3d5a73 130%)", accent: "#c9a24b" },
  mujer: { bg: "linear-gradient(120deg,#3a1420 0%,#93283a 60%,#caa46a 130%)", accent: "#f3d9d4" },
  general: { bg: "linear-gradient(120deg,#0b0d10 0%,#26140f 55%,#93283a 100%)", accent: "#c9a24b" },
};

export function HomeCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (slides.length ? (i + 1) % slides.length : 0));
  }, [slides.length]);

  const prev = () => setIndex((i) => (slides.length ? (i - 1 + slides.length) % slides.length : 0));

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];
  const theme = THEME_STYLES[slide.genderTheme] ?? THEME_STYLES.general;

  return (
    <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : theme.bg,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/45" />
          <div className="luxury-grain absolute inset-0" />

          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-14">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4 text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: theme.accent }}
              >
                AURA Perfumería
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="max-w-2xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
              >
                {slide.title}
              </motion.h2>
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="mt-4 max-w-lg text-base text-white/80 sm:text-lg"
                >
                  {slide.subtitle}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <Link
                  href={slide.linkUrl}
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-black transition-transform hover:scale-105 active:scale-95"
                  style={{ background: theme.accent }}
                >
                  {slide.ctaLabel}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
