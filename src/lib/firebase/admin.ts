import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApps()[0]!;
  }

  const normalizeEnv = (value: string | undefined) =>
    value?.trim().replace(/,+$/, "").replace(/^"+|"+$/g, "");

  const projectId = normalizeEnv(process.env.FIREBASE_PROJECT_ID);
  const clientEmail = normalizeEnv(process.env.FIREBASE_CLIENT_EMAIL);
  const privateKey = normalizeEnv(process.env.FIREBASE_PRIVATE_KEY)
    ?.replace(/\\n/g, "\n")
    .replace(/\r/g, "");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase admin credentials are not set.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
