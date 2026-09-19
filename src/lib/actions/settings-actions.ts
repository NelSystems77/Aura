"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "@/lib/repo/settings";
import { getCurrentAdmin, updateAdminPassword } from "@/lib/auth";

export type SettingsFormState = { error: string | null; success?: boolean };

export async function updateSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const fields = [
    "siteName",
    "siteTagline",
    "whatsappNumber",
    "whatsappNumberSecondary",
    "heroTitleHombre",
    "heroSubtitleHombre",
    "heroTitleMujer",
    "heroSubtitleMujer",
    "seoDescription",
    "instagramUrl",
    "facebookUrl",
  ] as const;

  const partial: Record<string, string> = {};
  for (const f of fields) {
    const value = formData.get(f);
    if (value !== null) partial[f] = String(value).trim();
  }

  if (!partial.whatsappNumber || partial.whatsappNumber.replace(/\D/g, "").length < 8) {
    return { error: "Ingresa un número de WhatsApp válido (con código de país, sin +)." };
  }
  if (partial.whatsappNumberSecondary && partial.whatsappNumberSecondary.replace(/\D/g, "").length < 8) {
    return { error: "El número de WhatsApp secundario no es válido." };
  }

  await updateSettings(partial);
  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export type PasswordFormState = { error: string | null; success?: boolean };

export async function updatePasswordAction(
  _prev: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Sesión expirada, vuelve a iniciar sesión." };

  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 8) {
    return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Las contraseñas nuevas no coinciden." };
  }

  await updateAdminPassword(admin.uid, newPassword);
  return { error: null, success: true };
}
