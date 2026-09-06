import { getDb } from "@/lib/db";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";

export function getSettings(): SiteSettings {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM settings").all() as {
    key: string;
    value: string;
  }[];
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
}

export function updateSettings(partial: Partial<SiteSettings>): SiteSettings {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  );
  for (const [key, value] of Object.entries(partial)) {
    if (value === undefined) continue;
    stmt.run(key, String(value));
  }
  return getSettings();
}
