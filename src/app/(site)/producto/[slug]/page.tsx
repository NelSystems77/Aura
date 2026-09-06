import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, listProducts } from "@/lib/repo/products";
import { getSettings } from "@/lib/repo/settings";
import { ProductMedia } from "@/components/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { ProductGrid } from "@/components/ProductGrid";
import { Container } from "@/components/ui/Container";
import { formatColones, formatDiscountPercent } from "@/lib/format";
import { buildWhatsAppLink, buildProductWhatsAppMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} — ${formatColones(product.currentPrice)}`;
  const description = `${product.name} de ${product.brand}. ${
    product.size ? `Presentación ${product.size}. ` : ""
  }Compra directa por WhatsApp con entrega en Costa Rica.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
    alternates: { canonical: `/producto/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const settings = getSettings();
  const siteUrl = process.env.SITE_URL || "https://aura-perfumeria.com";
  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    buildProductWhatsAppMessage(product, siteUrl)
  );
  const discount = formatDiscountPercent(product.regularPrice, product.currentPrice);
  const related = listProducts({ gender: product.gender, brand: product.brand })
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  const zoneClass = product.gender === "hombre" ? "zone-hombre" : "zone-mujer";
  const zoneHref = product.gender === "hombre" ? "/caballero" : "/dama";
  const zoneLabel = product.gender === "hombre" ? "Zona Caballero" : "Zona Dama";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    sku: String(product.id),
    description: `${product.name} de ${product.brand}${product.size ? `, ${product.size}` : ""}.`,
    offers: {
      "@type": "Offer",
      priceCurrency: "CRC",
      price: product.currentPrice,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/producto/${product.slug}`,
    },
  };

  return (
    <div className={`${zoneClass} min-h-screen`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-8 text-xs zone-muted-text sm:py-10">
        <Link href="/" className="hover:zone-accent-text">
          Inicio
        </Link>{" "}
        /{" "}
        <Link href={zoneHref} className="hover:zone-accent-text">
          {zoneLabel}
        </Link>{" "}
        / <span className="zone-accent-text">{product.brand}</span>
      </Container>

      <Container className="grid gap-10 pb-16 sm:grid-cols-2 sm:gap-14 sm:pb-24">
        <div className="relative h-80 overflow-hidden rounded-3xl border zone-border sm:h-[520px]">
          <ProductMedia
            slug={product.slug}
            brand={product.brand}
            gender={product.gender}
            tags={product.tags}
            imageUrl={product.imageUrl}
            name={product.name}
            className="h-full w-full"
          />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {discount > 0 && <Badge tone="danger">-{discount}% dscto.</Badge>}
            {product.isNew && <Badge tone="gold">Nuevo ingreso</Badge>}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="zone-accent-text text-xs font-bold uppercase tracking-[0.24em]">
            {product.brand}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight sm:text-4xl">
            {product.name}
          </h1>
          {product.size && <p className="zone-muted-text mt-2 text-sm">Presentación: {product.size}</p>}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-display)] text-3xl font-bold zone-accent-text sm:text-4xl">
              {formatColones(product.currentPrice)}
            </span>
            {discount > 0 && (
              <span className="zone-muted-text text-lg line-through">
                {formatColones(product.regularPrice)}
              </span>
            )}
          </div>

          <p className="zone-muted-text mt-2 text-xs uppercase tracking-wide">
            {product.available ? "✅ Disponible" : "❌ Agotado por ahora"}
          </p>

          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border zone-border px-3 py-1 text-[11px] uppercase tracking-wide zone-muted-text"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            {product.available ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_15px_35px_-12px_#25D366] transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
              >
                <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white">
                  <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.727-1.87A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3Z" />
                </svg>
                Comprar por WhatsApp
              </a>
            ) : (
              <span className="inline-flex w-full items-center justify-center rounded-full border zone-border px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] zone-muted-text sm:w-auto">
                No disponible por ahora
              </span>
            )}
          </div>

          <p className="zone-muted-text mt-4 text-xs">
            Pago vía SINPE Móvil, efectivo o depósito bancario. Coordinamos entrega o retiro.
          </p>
        </div>
      </Container>

      {related.length > 0 && (
        <div className="border-t zone-border py-14 sm:py-20">
          <Container>
            <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl font-bold">
              Más de {product.brand}
            </h2>
            <ProductGrid products={related} whatsappNumber={settings.whatsappNumber} siteUrl={siteUrl} />
          </Container>
        </div>
      )}
    </div>
  );
}
