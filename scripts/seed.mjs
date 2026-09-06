// Seed script: crea el usuario admin inicial y carga el catálogo de productos.
// Ejecutar con: npm run db:seed
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DB_PATH = process.env.DB_PATH || path.join(ROOT, "var", "data", "aura.db");
const SEED_FILE = path.join(ROOT, "data", "products-seed.json");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT '',
    gender TEXT NOT NULL CHECK (gender IN ('hombre','mujer')),
    size TEXT,
    regular_price INTEGER NOT NULL DEFAULT 0,
    current_price INTEGER NOT NULL DEFAULT 0,
    on_offer INTEGER NOT NULL DEFAULT 0,
    available INTEGER NOT NULL DEFAULT 1,
    is_new INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    tags TEXT NOT NULL DEFAULT '[]',
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT,
    source_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS carousel_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    image_url TEXT,
    link_url TEXT NOT NULL DEFAULT '/',
    cta_label TEXT NOT NULL DEFAULT 'Ver más',
    gender_theme TEXT NOT NULL DEFAULT 'general',
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// --- Admin user ---
const adminEmail = (process.env.ADMIN_EMAIL || "admin@aura.com").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "CambiaEsteClave123!";
const existingAdmin = db
  .prepare("SELECT id FROM admin_users WHERE email = ?")
  .get(adminEmail);

if (!existingAdmin) {
  db.prepare("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)").run(
    adminEmail,
    hashPassword(adminPassword)
  );
  console.log(`✔ Usuario admin creado: ${adminEmail}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      `  Contraseña temporal: ${adminPassword}  (defínela vía ADMIN_PASSWORD en .env y vuelve a correr el seed para cambiarla)`
    );
  }
} else {
  console.log(`— Usuario admin ya existe: ${adminEmail} (sin cambios)`);
}

// --- Default settings ---
const defaultSettings = {
  whatsappNumber: process.env.WHATSAPP_NUMBER || "50687409343",
  siteName: "AURA Perfumería",
  siteTagline: "Fragancias de lujo, entrega inmediata",
  heroTitleHombre: "El poder de tu presencia",
  heroSubtitleHombre: "Colonias importadas para el hombre que no pasa desapercibido",
  heroTitleMujer: "Tu esencia, tu poder",
  heroSubtitleMujer: "Perfumes exclusivos para la mujer que sabe lo que quiere",
  seoDescription:
    "AURA Perfumería — catálogo exclusivo de colonias y perfumes originales para hombre y mujer. Compra directa por WhatsApp con entrega en Costa Rica.",
  instagramUrl: "",
  facebookUrl: "",
};
const insertSetting = db.prepare(
  `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING`
);
for (const [key, value] of Object.entries(defaultSettings)) {
  insertSetting.run(key, String(value));
}

// --- Products ---
const productCount = db.prepare("SELECT COUNT(*) as c FROM products").get().c;

if (productCount > 0) {
  console.log(`— Ya existen ${productCount} productos en la base de datos. No se reimporta.`);
  console.log("  (Para reimportar desde cero, borra var/data/aura.db y vuelve a correr el seed.)");
} else {
  const raw = fs.readFileSync(SEED_FILE, "utf-8");
  const products = JSON.parse(raw);

  const insert = db.prepare(`
    INSERT INTO products
      (slug, name, brand, gender, size, regular_price, current_price, on_offer, available, is_new, featured, tags, description, image_url, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  let count = 0;
  // Marca como "nuevo" una muestra representativa por género para poblar la sección de nuevos ingresos.
  const newIndexesHombre = new Set();
  const newIndexesMujer = new Set();
  let hIdx = 0;
  let mIdx = 0;

  for (const p of products) {
    let isNew = false;
    if (p.gender === "hombre") {
      isNew = hIdx % 15 === 0;
      hIdx++;
    } else {
      isNew = mIdx % 15 === 0;
      mIdx++;
    }
    const featured = p.onOffer && count % 3 === 0;

    insert.run(
      p.slug,
      p.name,
      p.brand,
      p.gender,
      p.size ?? null,
      p.regularPrice ?? 0,
      p.currentPrice ?? p.regularPrice ?? 0,
      p.onOffer ? 1 : 0,
      p.available ? 1 : 0,
      isNew ? 1 : 0,
      featured ? 1 : 0,
      JSON.stringify(p.tags || []),
      "",
      null,
      p.sourceUrl ?? null
    );
    count++;
  }
  db.exec("COMMIT");
  console.log(`✔ ${count} productos importados desde data/products-seed.json`);
}

db.close();
console.log("Seed completado.");
