import type { Metadata } from "next";
import { Manrope, Playfair_Display, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/repo/settings";

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700", "800", "900"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const garamond = Cormorant_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://aura-perfumeria.com"),
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
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${body.variable} ${display.variable} ${cinzel.variable} ${garamond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
