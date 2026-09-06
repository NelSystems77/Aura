"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteSlide, insertSlide, updateSlide } from "@/lib/repo/carousel";
import type { GenderTheme } from "@/lib/types";

export type SlideFormState = { error: string | null };

function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/carrusel");
}

export async function upsertSlideAction(
  _prev: SlideFormState,
  formData: FormData
): Promise<SlideFormState> {
  const id = String(formData.get("id") || "");

  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const linkUrl = String(formData.get("linkUrl") || "/").trim();
  const ctaLabel = String(formData.get("ctaLabel") || "Ver más").trim();
  const genderTheme = String(formData.get("genderTheme") || "general") as GenderTheme;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const active = formData.get("active") === "on";

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  const input = {
    title,
    subtitle,
    imageUrl: imageUrl || null,
    linkUrl: linkUrl || "/",
    ctaLabel: ctaLabel || "Ver más",
    genderTheme,
    sortOrder,
    active,
  };

  if (id) {
    await updateSlide(id, input);
  } else {
    await insertSlide(input);
  }

  revalidateHome();
  redirect("/admin/carrusel");
}

export async function deleteSlideAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await deleteSlide(id);
  revalidateHome();
  redirect("/admin/carrusel");
}
