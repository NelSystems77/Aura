import type { Metadata } from "next";
import { listProducts } from "@/lib/repo/products";
import { getSettings } from "@/lib/repo/settings";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nuevos ingresos",
  description: "Las fragancias más recientes en nuestro catálogo, para hombre y mujer.",
};

export default async function NuevosIngresosPage() {
  const [settings, hombre, mujer] = await Promise.all([
    getSettings(),
    listProducts({ gender: "hombre", isNew: true, available: true }),
    listProducts({ gender: "mujer", isNew: true, available: true }),
  ]);

  return (
    <div>
      <div className="zone-mujer luxury-grain py-16 text-center sm:py-20">
        <Container>
          <p className="zone-accent-text text-xs font-bold uppercase tracking-[0.3em]">
            Recién llegados
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold sm:text-5xl">
            Nuevos ingresos
          </h1>
          <p className="zone-muted-text mx-auto mt-4 max-w-xl text-base">
            Las incorporaciones más recientes a nuestro catálogo de fragancias originales.
          </p>
        </Container>
      </div>

      <div className="zone-hombre py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Zona Caballero" title="Nuevo para él" href="/caballero" />
          <ProductGrid
            products={hombre}
            whatsappNumber={settings.whatsappNumber}
            emptyMessage="Pronto nuevos lanzamientos en esta zona."
          />
        </Container>
      </div>

      <div className="zone-mujer py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Zona Dama" title="Nuevo para ella" href="/dama" />
          <ProductGrid
            products={mujer}
            whatsappNumber={settings.whatsappNumber}
            emptyMessage="Pronto nuevos lanzamientos en esta zona."
          />
        </Container>
      </div>
    </div>
  );
}
