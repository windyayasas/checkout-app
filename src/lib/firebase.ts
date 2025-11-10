import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Centralized Firebase + Firestore initialization.
// Uses NEXT_PUBLIC_* env vars so both client and server components can access (avoid secret data here).
// Ensure these are set in .env.local and in production host (Vercel project settings).
export function getFirebaseApp() {
  if (getApps().length) return getApp();
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !authDomain || !projectId) {
    throw new Error('Missing Firebase env vars. Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  }

  return initializeApp({ apiKey, authDomain, projectId });
}

export const db = getFirestore(getFirebaseApp());
