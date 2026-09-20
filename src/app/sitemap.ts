import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/repo/products";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || "https://aura-perfumeria.com";
  const products = await listProducts({ available: true });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/caballero`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/dama`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/ofertas`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/nuevos-ingresos`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/resenas`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/producto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
