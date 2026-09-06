import type { Metadata } from "next";
import { Manrope, Playfair_Display, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { DEFAULT_SETTINGS } from "@/lib/types";

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

// Metadata estática (sin llamadas a Firestore): el layout raíz también envuelve
// rutas estáticas como /_not-found, que se generan en build sin acceso a la BD.
// El contenido dinámico de ajustes del sitio se aplica en app/(site)/layout.tsx,
// cuyas rutas son siempre dinámicas.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://aura-perfumeria.com"),
  title: {
    default: `${DEFAULT_SETTINGS.siteName} — ${DEFAULT_SETTINGS.siteTagline}`,
    template: `%s · ${DEFAULT_SETTINGS.siteName}`,
  },
  description: DEFAULT_SETTINGS.seoDescription,
  openGraph: {
    title: DEFAULT_SETTINGS.siteName,
    description: DEFAULT_SETTINGS.seoDescription,
    siteName: DEFAULT_SETTINGS.siteName,
    locale: "es_CR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SETTINGS.siteName,
    description: DEFAULT_SETTINGS.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
