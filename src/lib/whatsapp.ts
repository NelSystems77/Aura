import type { Product } from "@/lib/types";
import { formatColones } from "@/lib/format";

export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(product: Product, siteUrl?: string): string {
  const lines = [
    `Hola! Quiero comprar esta fragancia de AURA:`,
    `• ${product.name}${product.size ? ` (${product.size})` : ""}`,
    `• Precio: ${formatColones(product.currentPrice)}`,
  ];
  if (siteUrl) {
    lines.push(`• ${siteUrl}/producto/${product.slug}`);
  }
  lines.push("¿Me confirmas disponibilidad y métodos de pago?");
  return lines.join("\n");
}

export function buildGeneralWhatsAppMessage(): string {
  return "Hola! Vengo del sitio de AURA Perfumería y quisiera más información sobre sus fragancias.";
}
