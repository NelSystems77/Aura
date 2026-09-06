import type { Metadata } from "next";
import { getSettings } from "@/lib/repo/settings";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

// Todas las rutas bajo este grupo son `force-dynamic`, así que sí pueden leer
// Firestore para reflejar los ajustes editados desde /admin en el título,
// descripción y Open Graph por defecto de cada página.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.siteName} — ${settings.siteTagline}`,
      template: `%s · ${settings.siteName}`,
    },
    description: settings.seoDescription,
    openGraph: {
      title: settings.siteName,
      description: settings.seoDescription,
      siteName: settings.siteName,
      locale: "es_CR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.seoDescription,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const siteUrl = process.env.SITE_URL || "https://aura-perfumeria.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: siteUrl,
    description: settings.seoDescription,
    sameAs: [settings.instagramUrl, settings.facebookUrl].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: `+${settings.whatsappNumber}`,
      areaServed: "CR",
      availableLanguage: "Spanish",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <WhatsAppFloatingButton whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
