import type { Metadata } from "next";
import { listProducts } from "@/lib/repo/products";
import { getSettings } from "@/lib/repo/settings";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ofertas exclusivas",
  description: "Colonias y perfumes en oferta por tiempo limitado. Compra directa por WhatsApp.",
};

export default async function OfertasPage() {
  const settings = getSettings();
  const hombre = listProducts({ gender: "hombre", onOffer: true, available: true });
  const mujer = listProducts({ gender: "mujer", onOffer: true, available: true });

  return (
    <div>
      <div className="zone-hombre luxury-grain py-16 text-center sm:py-20">
        <Container>
          <p className="zone-accent-text text-xs font-bold uppercase tracking-[0.3em]">
            Por tiempo limitado
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold sm:text-5xl">
            Ofertas exclusivas AURA
          </h1>
          <p className="zone-muted-text mx-auto mt-4 max-w-xl text-base">
            Fragancias seleccionadas con descuento especial, disponibles mientras dure el stock.
          </p>
        </Container>
      </div>

      <div className="zone-hombre py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Zona Caballero" title="Ofertas para él" href="/caballero" />
          <ProductGrid
            products={hombre}
            whatsappNumber={settings.whatsappNumber}
            emptyMessage="Por ahora no hay ofertas activas en esta zona."
          />
        </Container>
      </div>

      <div className="zone-mujer py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Zona Dama" title="Ofertas para ella" href="/dama" />
          <ProductGrid
            products={mujer}
            whatsappNumber={settings.whatsappNumber}
            emptyMessage="Por ahora no hay ofertas activas en esta zona."
          />
        </Container>
      </div>
    </div>
  );
}
