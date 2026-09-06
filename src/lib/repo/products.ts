import { getDb } from "@/lib/db";
import type { Gender, Product, ProductInput } from "@/lib/types";

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  gender: string;
  size: string | null;
  regular_price: number;
  current_price: number;
  on_offer: number;
  available: number;
  is_new: number;
  featured: number;
  tags: string;
  description: string;
  image_url: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    gender: row.gender as Gender,
    size: row.size,
    regularPrice: row.regular_price,
    currentPrice: row.current_price,
    onOffer: !!row.on_offer,
    available: !!row.available,
    isNew: !!row.is_new,
    featured: !!row.featured,
    tags: JSON.parse(row.tags || "[]"),
    description: row.description || "",
    imageUrl: row.image_url,
    sourceUrl: row.source_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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

export function listProducts(filters: ProductFilters = {}): Product[] {
  const db = getDb();
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters.gender) {
    clauses.push("gender = ?");
    params.push(filters.gender);
  }
  if (filters.brand) {
    clauses.push("brand = ?");
    params.push(filters.brand);
  }
  if (filters.onOffer !== undefined) {
    clauses.push("on_offer = ?");
    params.push(filters.onOffer ? 1 : 0);
  }
  if (filters.available !== undefined) {
    clauses.push("available = ?");
    params.push(filters.available ? 1 : 0);
  }
  if (filters.isNew !== undefined) {
    clauses.push("is_new = ?");
    params.push(filters.isNew ? 1 : 0);
  }
  if (filters.featured !== undefined) {
    clauses.push("featured = ?");
    params.push(filters.featured ? 1 : 0);
  }
  if (filters.minPrice !== undefined) {
    clauses.push("current_price >= ?");
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    clauses.push("current_price <= ?");
    params.push(filters.maxPrice);
  }
  if (filters.tag) {
    clauses.push("tags LIKE ?");
    params.push(`%"${filters.tag}"%`);
  }
  if (filters.q) {
    clauses.push("(name LIKE ? OR brand LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const stmt = db.prepare(
    `SELECT * FROM products ${where} ORDER BY available DESC, featured DESC, name ASC`
  );
  const rows = stmt.all(...params) as unknown as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : null;
}

export function getProductById(id: number): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : null;
}

export function listBrands(gender?: Gender): string[] {
  const db = getDb();
  const rows = gender
    ? (db
        .prepare("SELECT DISTINCT brand FROM products WHERE gender = ? ORDER BY brand ASC")
        .all(gender) as { brand: string }[])
    : (db.prepare("SELECT DISTINCT brand FROM products ORDER BY brand ASC").all() as {
        brand: string;
      }[]);
  return rows.map((r) => r.brand).filter(Boolean);
}

export function countProducts(): {
  total: number;
  hombre: number;
  mujer: number;
  onOffer: number;
  outOfStock: number;
  isNew: number;
  featured: number;
} {
  const db = getDb();
  const get = (sql: string) => (db.prepare(sql).get() as { c: number }).c;
  return {
    total: get("SELECT COUNT(*) as c FROM products"),
    hombre: get("SELECT COUNT(*) as c FROM products WHERE gender='hombre'"),
    mujer: get("SELECT COUNT(*) as c FROM products WHERE gender='mujer'"),
    onOffer: get("SELECT COUNT(*) as c FROM products WHERE on_offer=1"),
    outOfStock: get("SELECT COUNT(*) as c FROM products WHERE available=0"),
    isNew: get("SELECT COUNT(*) as c FROM products WHERE is_new=1"),
    featured: get("SELECT COUNT(*) as c FROM products WHERE featured=1"),
  };
}

export function insertProduct(input: ProductInput): Product {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO products
      (slug, name, brand, gender, size, regular_price, current_price, on_offer, available, is_new, featured, tags, description, image_url, source_url, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(
    input.slug,
    input.name,
    input.brand,
    input.gender,
    input.size ?? null,
    input.regularPrice,
    input.currentPrice,
    input.onOffer ? 1 : 0,
    input.available ? 1 : 0,
    input.isNew ? 1 : 0,
    input.featured ? 1 : 0,
    JSON.stringify(input.tags || []),
    input.description ?? "",
    input.imageUrl ?? null,
    input.sourceUrl ?? null
  );
  return getProductById(Number(info.lastInsertRowid))!;
}

export function updateProduct(id: number, input: Partial<ProductInput>): Product | null {
  const current = getProductById(id);
  if (!current) return null;
  const merged: ProductInput = {
    slug: input.slug ?? current.slug,
    name: input.name ?? current.name,
    brand: input.brand ?? current.brand,
    gender: input.gender ?? current.gender,
    size: input.size !== undefined ? input.size : current.size,
    regularPrice: input.regularPrice ?? current.regularPrice,
    currentPrice: input.currentPrice ?? current.currentPrice,
    onOffer: input.onOffer !== undefined ? input.onOffer : current.onOffer,
    available: input.available !== undefined ? input.available : current.available,
    isNew: input.isNew !== undefined ? input.isNew : current.isNew,
    featured: input.featured !== undefined ? input.featured : current.featured,
    tags: input.tags ?? current.tags,
    description: input.description !== undefined ? input.description : current.description,
    imageUrl: input.imageUrl !== undefined ? input.imageUrl : current.imageUrl,
    sourceUrl: input.sourceUrl !== undefined ? input.sourceUrl : current.sourceUrl,
  };
  const db = getDb();
  db.prepare(
    `
    UPDATE products SET
      slug = ?, name = ?, brand = ?, gender = ?, size = ?, regular_price = ?, current_price = ?,
      on_offer = ?, available = ?, is_new = ?, featured = ?, tags = ?, description = ?,
      image_url = ?, source_url = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(
    merged.slug,
    merged.name,
    merged.brand,
    merged.gender,
    merged.size ?? null,
    merged.regularPrice,
    merged.currentPrice,
    merged.onOffer ? 1 : 0,
    merged.available ? 1 : 0,
    merged.isNew ? 1 : 0,
    merged.featured ? 1 : 0,
    JSON.stringify(merged.tags || []),
    merged.description ?? "",
    merged.imageUrl ?? null,
    merged.sourceUrl ?? null,
    id
  );
  return getProductById(id);
}

export function deleteProduct(id: number): void {
  const db = getDb();
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function countSeededProducts(): number {
  const db = getDb();
  return (db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number }).c;
}
