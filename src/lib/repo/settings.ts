import "server-only";
import { getAdminDb } from "@/lib/firebase-admin";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";

const DOC_PATH = { collection: "settings", doc: "site" };

export async function getSettings(): Promise<SiteSettings> {
  const db = getAdminDb();
  const snapshot = await db.collection(DOC_PATH.collection).doc(DOC_PATH.doc).get();
  const data = snapshot.exists ? (snapshot.data() as Partial<SiteSettings>) : {};
  return { ...DEFAULT_SETTINGS, ...data };
}

export async function updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = getAdminDb();
  const clean = Object.fromEntries(
    Object.entries(partial).filter(([, value]) => value !== undefined)
  );
  await db
    .collection(DOC_PATH.collection)
    .doc(DOC_PATH.doc)
    .set(clean, { merge: true });
  return getSettings();
}
