import type { Metadata } from "next";
import { listProducts, listBrands } from "@/lib/repo/products";
import { getSettings } from "@/lib/repo/settings";
import { ZoneHero } from "@/components/ZoneHero";
import { CatalogClient } from "@/components/CatalogClient";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: "Zona Caballero — Colonias para hombre",
    description: `${settings.heroSubtitleHombre}. Compra directa por WhatsApp.`,
  };
}

export default async function CaballeroPage() {
  const settings = getSettings();
  const products = listProducts({ gender: "hombre" });
  const brands = listBrands("hombre");

  return (
    <div className="zone-hombre min-h-screen">
      <ZoneHero
        eyebrow="Zona Caballero"
        title={settings.heroTitleHombre}
        subtitle={settings.heroSubtitleHombre}
      />
      <Container className="py-12 sm:py-16">
        <CatalogClient
          products={products}
          brands={brands}
          gender="hombre"
          whatsappNumber={settings.whatsappNumber}
        />
      </Container>
    </div>
  );
}
