import type { Gender } from "@/lib/types";
import { ProductVisual } from "@/components/ProductVisual";

type Props = {
  slug: string;
  brand: string;
  gender: Gender;
  tags: string[];
  imageUrl?: string | null;
  name: string;
  className?: string;
};

export function ProductMedia({ slug, brand, gender, tags, imageUrl, name, className }: Props) {
  if (imageUrl) {
    return (
      // Las URLs de imagen las ingresa el admin manualmente (marcas/host arbitrarios),
      // por eso se usa <img> nativo en vez de next/image (que exige allowlist de dominios).
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={`h-full w-full object-cover ${className ?? ""}`}
        loading="lazy"
      />
    );
  }

  return (
    <ProductVisual slug={slug} brand={brand} gender={gender} tags={tags} className={className} />
  );
}
