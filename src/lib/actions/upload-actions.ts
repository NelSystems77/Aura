"use server";

import { randomUUID } from "node:crypto";
import { getAdminStorage } from "@/lib/firebase-admin";
import { getCurrentAdmin } from "@/lib/auth";

export type UploadResult = { url: string; error?: undefined } | { error: string; url?: undefined };

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Tu sesión expiró, vuelve a iniciar sesión." };
  }

  const file = formData.get("file");
  const folderRaw = String(formData.get("folder") || "products");
  const folder = folderRaw === "carousel" ? "carousel" : "products";

  if (!(file instanceof File)) {
    return { error: "No se recibió ningún archivo." };
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return { error: "Formato no soportado. Usa JPG, PNG, WEBP o GIF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "La imagen pesa más de 8MB. Comprímela antes de subirla." };
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return { error: "No se pudo leer el archivo. Intenta de nuevo." };
  }

  const path = `${folder}/${randomUUID()}.${ext}`;
  const token = randomUUID();

  try {
    const bucket = getAdminStorage().bucket();
    const gcsFile = bucket.file(path);
    await gcsFile.save(buffer, {
      contentType: file.type,
      metadata: {
        contentType: file.type,
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      path
    )}?alt=media&token=${token}`;

    return { url };
  } catch (err) {
    console.error("uploadImageAction failed", err);
    return { error: "No se pudo subir la imagen. Intenta de nuevo." };
  }
}
