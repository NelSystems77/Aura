import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

export const SESSION_COOKIE_NAME = "aura_admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET no está configurado. Defínelo en tu archivo .env (ver .env.example)."
    );
  }
  return secret;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(email: string): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${email}|${expires}`;
  const signature = sign(payload);
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifySessionToken(token: string | undefined | null): { email: string } | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, expiresStr, signature] = decoded.split("|");
    if (!email || !expiresStr || !signature) return null;
    const expected = sign(`${email}|${expiresStr}`);
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
    if (Date.now() > Number(expiresStr)) return null;
    return { email };
  } catch {
    return null;
  }
}
