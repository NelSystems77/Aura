export type Gender = "hombre" | "mujer";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender: Gender;
  size: string | null;
  regularPrice: number;
  currentPrice: number;
  onOffer: boolean;
  available: boolean;
  isNew: boolean;
  featured: boolean;
  tags: string[];
  description: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  slug: string;
  name: string;
  brand: string;
  gender: Gender;
  size?: string | null;
  regularPrice: number;
  currentPrice: number;
  onOffer: boolean;
  available: boolean;
  isNew: boolean;
  featured: boolean;
  tags: string[];
  description?: string;
  imageUrl?: string | null;
  sourceUrl?: string | null;
};

export type GenderTheme = Gender | "general";

export type CarouselSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  linkUrl: string;
  ctaLabel: string;
  genderTheme: GenderTheme;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CarouselSlideInput = {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  linkUrl?: string;
  ctaLabel?: string;
  genderTheme: GenderTheme;
  sortOrder?: number;
  active: boolean;
};

export type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export type ReviewInput = {
  customerName: string;
  rating: number;
  comment: string;
};

export type SiteSettings = {
  whatsappNumber: string;
  whatsappNumberSecondary: string;
  siteName: string;
  siteTagline: string;
  heroTitleHombre: string;
  heroSubtitleHombre: string;
  heroTitleMujer: string;
  heroSubtitleMujer: string;
  seoDescription: string;
  instagramUrl: string;
  facebookUrl: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "50671565232",
  whatsappNumberSecondary: "50687409343",
  siteName: "AURA Perfumería",
  siteTagline: "Fragancias de lujo, entrega inmediata",
  heroTitleHombre: "El poder de tu presencia",
  heroSubtitleHombre: "Colonias importadas para el hombre que no pasa desapercibido",
  heroTitleMujer: "Tu esencia, tu poder",
  heroSubtitleMujer: "Perfumes exclusivos para la mujer que sabe lo que quiere",
  seoDescription:
    "AURA Perfumería — catálogo exclusivo de colonias y perfumes originales para hombre y mujer. Compra directa por WhatsApp con entrega en Costa Rica.",
  instagramUrl: "",
  facebookUrl: "",
};
