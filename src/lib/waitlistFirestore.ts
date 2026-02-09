import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const WAITLIST_APP_NAME = "moneybear-waitlist";

const getWaitlistEnv = () => {
  const projectId = process.env.WAITLIST_FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.WAITLIST_FIREBASE_CLIENT_EMAIL ?? "";
  const privateKey = process.env.WAITLIST_FIREBASE_PRIVATE_KEY ?? "";

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    // Vercel sometimes stores multiline secrets with literal "\n" sequences.
    privateKey: privateKey.replace(/\\n/g, "\n"),
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

  return getFirestore(app);
};

