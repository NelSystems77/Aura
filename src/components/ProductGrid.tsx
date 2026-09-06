import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({
  products,
  whatsappNumber,
  siteUrl,
  emptyMessage = "No hay productos que coincidan con tu búsqueda.",
}: {
  products: Product[];
  whatsappNumber: string;
  siteUrl?: string;
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return <p className="zone-muted-text py-16 text-center text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          whatsappNumber={whatsappNumber}
          siteUrl={siteUrl}
          index={i}
        />
      ))}
    </div>
  );
}
