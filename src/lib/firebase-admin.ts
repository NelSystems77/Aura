import "server-only";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

function createAdminApp(): App {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID no está configurado (ver .env.example)."
    );
  }

  // Producción en Firebase App Hosting: las credenciales se resuelven solas
  // (Application Default Credentials), no hace falta ninguna clave.
  // Desarrollo local: se usa el emulador (ver `npm run dev`), que no valida
  // credenciales, o bien una clave de cuenta de servicio vía
  // GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_SERVICE_ACCOUNT_KEY.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    return initializeApp({
      projectId,
      credential: cert(JSON.parse(serviceAccountJson)),
    });
  }

  return initializeApp({ projectId });
}

function getAdminApp(): App {
  const existing = getApps();
  return existing.length ? existing[0] : createAdminApp();
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
