import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import type { Gender, Product, ProductInput } from "@/lib/types";

const COLLECTION = "products";

type ProductDoc = Omit<Product, "id">;

function docToProduct(
  doc: FirebaseFirestore.DocumentSnapshot | FirebaseFirestore.QueryDocumentSnapshot
): Product | null {
  if (!doc.exists) return null;
  const data = doc.data() as ProductDoc;
  return { id: doc.id, ...data };
}

export type ProductFilters = {
  gender?: Gender;
  brand?: string;
  onOffer?: boolean;
  available?: boolean;
  isNew?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tag?: string;
  q?: string;
};

function sortProducts(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const db = getAdminDb();
  const base: FirebaseFirestore.Query = filters.gender
    ? db.collection(COLLECTION).where("gender", "==", filters.gender)
    : db.collection(COLLECTION);

  const snapshot = await base.get();
  let list = snapshot.docs
    .map(docToProduct)
    .filter((p): p is Product => p !== null);

  if (filters.brand) list = list.filter((p) => p.brand === filters.brand);
  if (filters.onOffer !== undefined) list = list.filter((p) => p.onOffer === filters.onOffer);
  if (filters.available !== undefined) list = list.filter((p) => p.available === filters.available);
  if (filters.isNew !== undefined) list = list.filter((p) => p.isNew === filters.isNew);
  if (filters.featured !== undefined) list = list.filter((p) => p.featured === filters.featured);
  if (filters.minPrice !== undefined) list = list.filter((p) => p.currentPrice >= filters.minPrice!);
  if (filters.maxPrice !== undefined) list = list.filter((p) => p.currentPrice <= filters.maxPrice!);
  if (filters.tag) list = list.filter((p) => p.tags.includes(filters.tag!));
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  return sortProducts(list);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getAdminDb();
  const doc = await db.collection(COLLECTION).doc(slug).get();
  return docToProduct(doc);
}

export async function getProductById(id: string): Promise<Product | null> {
  return getProductBySlug(id);
}

export async function listBrands(gender?: Gender): Promise<string[]> {
  const db = getAdminDb();
  const base = gender
    ? db.collection(COLLECTION).where("gender", "==", gender)
    : db.collection(COLLECTION);
  const snapshot = await base.select("brand").get();
  const brands = new Set<string>();
  snapshot.docs.forEach((doc) => {
    const brand = doc.get("brand");
    if (brand) brands.add(brand as string);
  });
  return Array.from(brands).sort((a, b) => a.localeCompare(b));
}

export async function countProducts(): Promise<{
  total: number;
  hombre: number;
  mujer: number;
  onOffer: number;
  outOfStock: number;
  isNew: number;
  featured: number;
}> {
  const db = getAdminDb();
  const col = db.collection(COLLECTION);
  const [total, hombre, mujer, onOffer, outOfStock, isNew, featured] = await Promise.all([
    col.count().get(),
    col.where("gender", "==", "hombre").count().get(),
    col.where("gender", "==", "mujer").count().get(),
    col.where("onOffer", "==", true).count().get(),
    col.where("available", "==", false).count().get(),
    col.where("isNew", "==", true).count().get(),
    col.where("featured", "==", true).count().get(),
  ]);
  return {
    total: total.data().count,
    hombre: hombre.data().count,
    mujer: mujer.data().count,
    onOffer: onOffer.data().count,
    outOfStock: outOfStock.data().count,
    isNew: isNew.data().count,
    featured: featured.data().count,
  };
}

function toDoc(input: ProductInput, now: string): ProductDoc {
  return {
    slug: input.slug,
    name: input.name,
    brand: input.brand,
    gender: input.gender,
    size: input.size ?? null,
    regularPrice: input.regularPrice,
    currentPrice: input.currentPrice,
    onOffer: input.onOffer,
    available: input.available,
    isNew: input.isNew,
    featured: input.featured,
    tags: input.tags || [],
    description: input.description ?? "",
    imageUrl: input.imageUrl ?? null,
    sourceUrl: input.sourceUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function insertProduct(input: ProductInput): Promise<Product> {
  const db = getAdminDb();
  const now = new Date().toISOString();
  const doc = toDoc(input, now);
  await db.collection(COLLECTION).doc(input.slug).set(doc);
  return { id: input.slug, ...doc };
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product | null> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(id);
  const current = await ref.get();
  if (!current.exists) return null;

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && key !== "slug") {
      patch[key] = value;
    }
  }

  await ref.update(patch);
  const updated = await ref.get();
  return docToProduct(updated);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getAdminDb();
  await db.collection(COLLECTION).doc(id).delete();
}

/**
 * Suma `amount` (puede ser negativo) al precio regular y al precio actual de
 * TODOS los productos, de golpe. Usa FieldValue.increment para que sea una
 * operación atómica por documento (no requiere leer el precio actual antes).
 * Devuelve la cantidad de productos afectados.
 */
export async function incrementAllPrices(amount: number, gender?: Gender): Promise<number> {
  const db = getAdminDb();
  const base = gender
    ? db.collection(COLLECTION).where("gender", "==", gender)
    : db.collection(COLLECTION);
  const snapshot = await base.select().get();
  const now = new Date().toISOString();

  const BATCH_SIZE = 400;
  const refs = snapshot.docs.map((d) => d.ref);
  for (let i = 0; i < refs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    for (const ref of refs.slice(i, i + BATCH_SIZE)) {
      batch.update(ref, {
        regularPrice: FieldValue.increment(amount),
        currentPrice: FieldValue.increment(amount),
        updatedAt: now,
      });
    }
    await batch.commit();
  }

  return refs.length;
}
