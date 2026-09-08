"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteProduct,
  getProductById,
  getProductBySlug,
  incrementAllPrices,
  insertProduct,
  updateProduct,
} from "@/lib/repo/products";
import type { Gender } from "@/lib/types";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidatePublicRoutes() {
  revalidatePath("/");
  revalidatePath("/caballero");
  revalidatePath("/dama");
  revalidatePath("/ofertas");
  revalidatePath("/nuevos-ingresos");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
}

const VALID_TOGGLE_FIELDS = ["onOffer", "available", "isNew", "featured"] as const;
type ToggleField = (typeof VALID_TOGGLE_FIELDS)[number];

export async function toggleProductFlagAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const field = String(formData.get("field")) as ToggleField;
  if (!id || !VALID_TOGGLE_FIELDS.includes(field)) return;

  const product = await getProductById(id);
  if (!product) return;

  await updateProduct(id, { [field]: !product[field] });
  revalidatePublicRoutes();
  revalidatePath(`/producto/${product.slug}`);
}

export type ProductFormState = { error: string | null };

export async function upsertProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const id = String(formData.get("id") || "");

  const name = String(formData.get("name") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const gender = String(formData.get("gender") || "hombre") as Gender;
  const size = String(formData.get("size") || "").trim();
  const regularPrice = Number(formData.get("regularPrice") || 0);
  const currentPrice = Number(formData.get("currentPrice") || regularPrice);
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const tagsRaw = String(formData.get("tags") || "").trim();
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const onOffer = formData.get("onOffer") === "on";
  const available = formData.get("available") === "on";
  const isNew = formData.get("isNew") === "on";
  const featured = formData.get("featured") === "on";

  if (!name || !brand || !regularPrice) {
    return { error: "Nombre, marca y precio regular son obligatorios." };
  }

  const input = {
    slug: "",
    name,
    brand,
    gender,
    size: size || null,
    regularPrice,
    currentPrice,
    onOffer,
    available,
    isNew,
    featured,
    tags,
    description,
    imageUrl: imageUrl || null,
  };

  if (id) {
    await updateProduct(id, input);
  } else {
    const baseSlug = slugify(`${gender}-${name}`);
    let slug = baseSlug;
    let n = 2;
    while (await getProductBySlug(slug)) {
      slug = `${baseSlug}-${n}`;
      n++;
    }
    await insertProduct({ ...input, slug });
  }

  revalidatePublicRoutes();
  redirect("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await deleteProduct(id);
  revalidatePublicRoutes();
  redirect("/admin/productos");
}

export type BulkPriceState = { error: string | null; success?: string };

export async function bulkAdjustPricesAction(
  _prev: BulkPriceState,
  formData: FormData
): Promise<BulkPriceState> {
  const amount = Number(formData.get("amount"));
  const genderRaw = String(formData.get("gender") || "");
  const gender = genderRaw === "hombre" || genderRaw === "mujer" ? (genderRaw as Gender) : undefined;

  if (!amount || Number.isNaN(amount)) {
    return { error: "Ingresa un monto distinto de cero (puede ser negativo para bajar precios)." };
  }

  const count = await incrementAllPrices(amount, gender);
  revalidatePublicRoutes();

  const sign = amount > 0 ? "+" : "";
  const scope = gender ? (gender === "hombre" ? "Caballero" : "Dama") : "todo el catálogo";
  return {
    error: null,
    success: `Listo: ${sign}₡${amount.toLocaleString("es-CR")} aplicado a ${count} productos (${scope}).`,
  };
}
