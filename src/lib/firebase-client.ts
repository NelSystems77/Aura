"use client";

import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  return getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
}

let emulatorConnected = false;

export function getClientAuth() {
  const auth = getAuth(getFirebaseApp());
  const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
  if (emulatorHost && !emulatorConnected) {
    connectAuthEmulator(auth, `http://${emulatorHost}`, { disableWarnings: true });
    emulatorConnected = true;
  }
  return auth;
}
