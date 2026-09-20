"use server";

import { revalidatePath } from "next/cache";
import {
  approveReview,
  deleteReview,
  insertReview,
} from "@/lib/repo/reviews";

export type ReviewFormState = { error: string | null; success?: boolean };

const MAX_NAME_LENGTH = 80;
const MAX_COMMENT_LENGTH = 800;

export async function submitReviewAction(
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  // Campo señuelo invisible: si viene lleno, es un bot.
  if (String(formData.get("website") || "").trim()) {
    return { error: null, success: true };
  }

  const customerName = String(formData.get("customerName") || "").trim().slice(0, MAX_NAME_LENGTH);
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") || "").trim().slice(0, MAX_COMMENT_LENGTH);

  if (!customerName) {
    return { error: "Cuéntanos tu nombre." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Selecciona una calificación de 1 a 5 estrellas." };
  }
  if (comment.length < 10) {
    return { error: "Cuéntanos un poco más sobre tu experiencia (mínimo 10 caracteres)." };
  }

  await insertReview({ customerName, rating, comment });
  revalidatePath("/resenas");
  revalidatePath("/");

  return { error: null, success: true };
}

function revalidateReviewRoutes() {
  revalidatePath("/resenas");
  revalidatePath("/");
  revalidatePath("/admin/resenas");
  revalidatePath("/admin");
}

export async function approveReviewAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await approveReview(id);
  revalidateReviewRoutes();
}

export async function deleteReviewAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await deleteReview(id);
  revalidateReviewRoutes();
}
