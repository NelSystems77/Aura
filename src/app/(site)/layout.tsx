import { getSettings } from "@/lib/repo/settings";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
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
