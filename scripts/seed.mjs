// Seed script: carga el catálogo de productos y los ajustes por defecto en
// Firestore. En modo emulador, además crea usuarios de prueba en Firebase
// Auth con los mismos UID de los administradores reales, para poder probar
// el login localmente sin tocar las cuentas de producción.
//
// Uso:
//   Contra el emulador:  firebase emulators:exec "node scripts/seed.mjs"
//   Contra producción:   GOOGLE_APPLICATION_CREDENTIALS=... node scripts/seed.mjs
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_FILE = path.join(ROOT, "data", "products-seed.json");

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error("Falta NEXT_PUBLIC_FIREBASE_PROJECT_ID en el entorno (.env).");
  process.exit(1);
}

const isEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

initializeApp({ projectId });
const db = getFirestore();
const auth = getAuth();

async function seedSettings() {
  const ref = db.collection("settings").doc("site");
  const snapshot = await ref.get();
  if (snapshot.exists) {
    console.log("— El documento de ajustes ya existe, no se sobrescribe.");
    return;
  }
  await ref.set({
    whatsappNumber: process.env.WHATSAPP_NUMBER || "50671565232",
    whatsappNumberSecondary: process.env.WHATSAPP_NUMBER_SECONDARY || "50687409343",
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
  });
  console.log("✔ Ajustes por defecto creados en settings/site");
}

async function seedProducts() {
  const col = db.collection("products");
  const existing = await col.limit(1).get();
  if (!existing.empty) {
    console.log("— Ya existen productos en Firestore. No se reimporta (borra la colección para forzar).");
    return;
  }

  const products = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8"));
  const now = new Date().toISOString();

  const BATCH_SIZE = 400;
  let count = 0;
  let hIdx = 0;
  let mIdx = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = products.slice(i, i + BATCH_SIZE);

    for (const p of chunk) {
      let isNew;
      if (p.gender === "hombre") {
        isNew = hIdx % 15 === 0;
        hIdx++;
      } else {
        isNew = mIdx % 15 === 0;
        mIdx++;
      }
      const featured = p.onOffer && count % 3 === 0;

      const ref = col.doc(p.slug);
      batch.set(ref, {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        gender: p.gender,
        size: p.size ?? null,
        regularPrice: p.regularPrice ?? 0,
        currentPrice: p.currentPrice ?? p.regularPrice ?? 0,
        onOffer: Boolean(p.onOffer),
        available: Boolean(p.available),
        isNew,
        featured,
        tags: p.tags || [],
        description: "",
        imageUrl: null,
        sourceUrl: p.sourceUrl ?? null,
        createdAt: now,
        updatedAt: now,
      });
      count++;
    }

    await batch.commit();
    console.log(`  … ${Math.min(i + BATCH_SIZE, products.length)}/${products.length} productos`);
  }

  console.log(`✔ ${count} productos importados a Firestore`);
}

async function seedEmulatorAdmins() {
  if (!isEmulator) {
    console.log("— Modo producción: se asume que los administradores ya existen en Firebase Auth.");
    return;
  }

  const uids = (process.env.ADMIN_UIDS || "").split(",").map((v) => v.trim()).filter(Boolean);
  if (uids.length === 0) {
    console.log("— ADMIN_UIDS no está definido, no se crean usuarios de prueba.");
    return;
  }

  for (const [i, uid] of uids.entries()) {
    const email = `admin${i + 1}@aura.test`;
    const password = "AuraAdmin123!";
    try {
      await auth.getUser(uid);
      console.log(`— Usuario de prueba ${uid} ya existe en el emulador.`);
    } catch {
      await auth.createUser({ uid, email, password, emailVerified: true });
      console.log(`✔ Usuario de prueba creado en el emulador: ${email} / ${password} (uid ${uid})`);
    }
  }
}

async function main() {
  await seedSettings();
  await seedProducts();
  await seedEmulatorAdmins();
  console.log("Seed completado.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
