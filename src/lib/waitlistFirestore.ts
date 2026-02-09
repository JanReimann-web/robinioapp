import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const WAITLIST_APP_NAME = "moneybear-waitlist";

const normalizeDatabaseId = (databaseId: string) => {
  const trimmed = databaseId.trim();
  if (!trimmed) return "";
  // Common human-friendly alias.
  if (trimmed === "default") return "(default)";
  return trimmed;
};

const getWaitlistEnv = () => {
  const projectId = process.env.WAITLIST_FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.WAITLIST_FIREBASE_CLIENT_EMAIL ?? "";
  const privateKey = process.env.WAITLIST_FIREBASE_PRIVATE_KEY ?? "";
  const databaseId = normalizeDatabaseId(
    process.env.WAITLIST_FIREBASE_DATABASE_ID ?? ""
  );

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    // Vercel sometimes stores multiline secrets with literal "\n" sequences.
    privateKey: privateKey.replace(/\\n/g, "\n"),
    databaseId,
  };
};

export const getWaitlistFirestore = () => {
  const env = getWaitlistEnv();
  if (!env) {
    return null;
  }

  const existing = getApps().find((app) => app.name === WAITLIST_APP_NAME);
  const app =
    existing ??
    initializeApp(
      {
        credential: cert(env),
      },
      WAITLIST_APP_NAME
    );

  if (env.databaseId) {
    return getFirestore(app, env.databaseId);
  }
  return getFirestore(app);
};
