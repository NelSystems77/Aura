"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteProduct,
  getProductById,
  getProductBySlug,
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
  const id = Number(formData.get("id"));
  const field = String(formData.get("field")) as ToggleField;
  if (!id || !VALID_TOGGLE_FIELDS.includes(field)) return;

  const product = getProductById(id);
  if (!product) return;

  updateProduct(id, { [field]: !product[field] });
  revalidatePublicRoutes();
  revalidatePath(`/producto/${product.slug}`);
}

export type ProductFormState = { error: string | null };

export async function upsertProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

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

  const baseSlug = slugify(`${gender}-${name}`);

  const input = {
    slug: baseSlug,
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
    updateProduct(id, input);
  } else {
    let slug = baseSlug;
    let n = 2;
    while (getProductBySlug(slug)) {
      slug = `${baseSlug}-${n}`;
      n++;
    }
    insertProduct({ ...input, slug });
  }

  revalidatePublicRoutes();
  redirect("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  deleteProduct(id);
  revalidatePublicRoutes();
  redirect("/admin/productos");
}
