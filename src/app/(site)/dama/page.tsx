import type { Metadata } from "next";
import { listProducts, listBrands } from "@/lib/repo/products";
import { getSettings } from "@/lib/repo/settings";
import { ZoneHero } from "@/components/ZoneHero";
import { CatalogClient } from "@/components/CatalogClient";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Zona Dama — Perfumes para mujer",
    description: `${settings.heroSubtitleMujer}. Compra directa por WhatsApp.`,
  };
}

export default async function DamaPage() {
  const [settings, products, brands] = await Promise.all([
    getSettings(),
    listProducts({ gender: "mujer" }),
    listBrands("mujer"),
  ]);

  return (
    <div className="zone-mujer min-h-screen">
      <ZoneHero
        eyebrow="Zona Dama"
        title={settings.heroTitleMujer}
        subtitle={settings.heroSubtitleMujer}
      />
      <Container className="py-12 sm:py-16">
        <CatalogClient
          products={products}
          brands={brands}
          gender="mujer"
          whatsappNumber={settings.whatsappNumber}
        />
      </Container>
    </div>
  );
}
