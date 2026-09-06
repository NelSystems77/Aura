import "server-only";
import { getAdminAuth } from "@/lib/firebase-admin";

// Sin dependencia de "next/headers": este módulo lo usan tanto el proxy
// (middleware) como las Server Actions/Componentes, y el proxy no tiene
// acceso al contexto de `cookies()` de RSC.

export const SESSION_COOKIE_NAME = "aura_admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 5; // 5 días

export function getAdminUids(): string[] {
  return (process.env.ADMIN_UIDS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function isAdminUid(uid: string): boolean {
  return getAdminUids().includes(uid);
}

export async function verifySessionCookieToken(
  token: string | undefined
): Promise<{ uid: string; email: string | null } | null> {
  if (!token) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(token, true);
    if (!isAdminUid(decoded.uid)) return null;
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}
