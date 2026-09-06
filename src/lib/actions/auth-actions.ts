"use server";

import { redirect } from "next/navigation";
import { createSessionCookieFromIdToken, clearSessionCookie } from "@/lib/auth";

export type SessionActionResult = { error: string } | undefined;

export async function createSessionAction(
  idToken: string,
  next: string
): Promise<SessionActionResult> {
  const result = await createSessionCookieFromIdToken(idToken);
  if (!result.ok) {
    return { error: result.error };
  }
  redirect(next && next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
