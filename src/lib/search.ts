import Fuse from "fuse.js";
import type { Product } from "@/lib/types";

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const FAMILY_KEYWORDS: Record<string, string[]> = {
  Dulce: ["dulce", "dulzura", "gourmand", "vainilla", "azucar", "caramelo", "goloso", "chocolate"],
  Floral: ["floral", "flores", "flor", "rosas", "delicado", "romantico", "femenino"],
  Citrico: ["citrico", "citrus", "limon", "naranja", "energizante", "vitalidad"],
  "Fresco / Acuatico": [
    "fresco",
    "acuatico",
    "marino",
    "playa",
    "verano",
    "dia",
    "deportivo",
    "gimnasio",
    "ligero",
  ],
  Amaderado: ["amaderado", "madera", "oud", "almizcle", "otono", "invierno", "ambar", "serio"],
  Especiado: ["especiado", "especias", "canela", "picante", "calido"],
  "Nocturno / Intenso": [
    "noche",
    "nocturno",
    "intenso",
    "fiesta",
    "seduccion",
    "seductor",
    "elegante",
    "cita",
    "impactante",
    "fuerte",
  ],
};

export function detectTagsFromQuery(query: string): string[] {
  const q = stripAccents(query.toLowerCase());
  const matched = new Set<string>();
  for (const [tag, words] of Object.entries(FAMILY_KEYWORDS)) {
    if (words.some((w) => q.includes(w))) {
      matched.add(tag);
    }
  }
  return Array.from(matched);
}

export function createProductSearchIndex(products: Product[]) {
  return new Fuse(products, {
    keys: [
      { name: "name", weight: 0.5 },
      { name: "brand", weight: 0.3 },
      { name: "tags", weight: 0.2 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

export function smartSearch(
  products: Product[],
  index: Fuse<Product>,
  query: string
): Product[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tags = detectTagsFromQuery(trimmed);
  const fuseResults = index.search(trimmed).map((r) => r.item);

  if (tags.length === 0) {
    return fuseResults;
  }

  const byTag = products.filter((p) => p.tags.some((t) => tags.includes(t)));

  if (fuseResults.length === 0) {
    return byTag;
  }

  const fuseSlugs = new Set(fuseResults.map((p) => p.slug));
  const merged = [...fuseResults, ...byTag.filter((p) => !fuseSlugs.has(p.slug))];
  return merged;
}
