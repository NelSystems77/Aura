import "server-only";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  createSessionToken,
  hashPassword,
  verifySessionToken,
  verifyPassword,
} from "@/lib/auth-core";

export { hashPassword, verifyPassword, verifySessionToken, SESSION_COOKIE_NAME };

type AdminUserRow = { id: number; email: string; password_hash: string };

export function findAdminByEmail(email: string): AdminUserRow | null {
  const db = getDb();
  const row = db
    .prepare("SELECT id, email, password_hash FROM admin_users WHERE email = ?")
    .get(email.toLowerCase()) as AdminUserRow | undefined;
  return row ?? null;
}

export function createAdminUser(email: string, password: string) {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO admin_users (email, password_hash) VALUES (?, ?)").run(
    email.toLowerCase(),
    hashPassword(password)
  );
}

export function updateAdminPassword(email: string, newPassword: string) {
  const db = getDb();
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE email = ?").run(
    hashPassword(newPassword),
    email.toLowerCase()
  );
}

export async function setSessionCookie(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
