import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  isAdminUid,
  verifySessionCookieToken,
} from "@/lib/session";

export { SESSION_COOKIE_NAME };

export async function createSessionCookieFromIdToken(
  idToken: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = getAdminAuth();

  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken, true);
  } catch {
    return { ok: false, error: "No se pudo verificar tu sesión. Intenta de nuevo." };
  }

  if (!isAdminUid(decoded.uid)) {
    return { ok: false, error: "Esta cuenta no tiene permisos de administrador." };
  }

  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_TTL_MS });
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return { ok: true };
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<{ uid: string; email: string | null } | null> {
  const store = await cookies();
  return verifySessionCookieToken(store.get(SESSION_COOKIE_NAME)?.value);
}

export async function updateAdminPassword(uid: string, newPassword: string) {
  await getAdminAuth().updateUser(uid, { password: newPassword });
}
