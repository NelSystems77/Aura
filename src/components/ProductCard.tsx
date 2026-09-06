"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductMedia } from "@/components/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { formatColones, formatDiscountPercent } from "@/lib/format";
import { buildWhatsAppLink, buildProductWhatsAppMessage } from "@/lib/whatsapp";

export function ProductCard({
  product,
  whatsappNumber,
  siteUrl,
  index = 0,
}: {
  product: Product;
  whatsappNumber: string;
  siteUrl?: string;
  index?: number;
}) {
  const discount = formatDiscountPercent(product.regularPrice, product.currentPrice);
  const waLink = buildWhatsAppLink(whatsappNumber, buildProductWhatsAppMessage(product, siteUrl));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4), ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border zone-border zone-surface transition-shadow duration-300 hover:shadow-[0_25px_50px_-20px_var(--zone-accent)]"
    >
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative h-56 w-full overflow-hidden sm:h-64">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
            <ProductMedia
              slug={product.slug}
              brand={product.brand}
              gender={product.gender}
              tags={product.tags}
              imageUrl={product.imageUrl}
              name={product.name}
              className="h-full w-full"
            />
          </div>

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && <Badge tone="danger">-{discount}%</Badge>}
            {product.isNew && product.available && <Badge tone="gold">Nuevo</Badge>}
          </div>
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[1px]">
              <span className="rounded-full border border-white/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                Agotado
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <p className="zone-muted-text text-[11px] font-semibold uppercase tracking-[0.16em]">
          {product.brand}
        </p>
        <Link href={`/producto/${product.slug}`}>
          <h3 className="line-clamp-2 font-[family-name:var(--font-display)] text-base font-semibold leading-snug transition-colors group-hover:zone-accent-text sm:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="zone-accent-text font-[family-name:var(--font-display)] text-lg font-bold sm:text-xl">
            {formatColones(product.currentPrice)}
          </span>
          {discount > 0 && (
            <span className="zone-muted-text text-sm line-through">
              {formatColones(product.regularPrice)}
            </span>
          )}
        </div>

        <div className="mt-3">
          {product.available ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_25px_-10px_#25D366] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Comprar por WhatsApp
            </a>
          ) : (
            <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border zone-border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] zone-muted-text">
              No disponible
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
