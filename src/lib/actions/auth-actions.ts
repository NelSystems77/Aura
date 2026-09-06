"use server";

import { redirect } from "next/navigation";
import { findAdminByEmail, setSessionCookie, clearSessionCookie, verifyPassword } from "@/lib/auth";

export type LoginState = { error: string | null };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  if (!email || !password) {
    return { error: "Ingresa correo y contraseña." };
  }

  const admin = findAdminByEmail(email);
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    return { error: "Credenciales incorrectas." };
  }

  await setSessionCookie(admin.email);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
