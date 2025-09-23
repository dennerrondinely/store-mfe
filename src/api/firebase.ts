import { initializeApp } from 'firebase/app';

import {
  doc,
  onSnapshot,
  addDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
  getFirestore,
  Firestore,
  where,
  type WithFieldValue,
} from 'firebase/firestore';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';


export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export type { WithFieldValue };

export {
  doc,
  onSnapshot,
  addDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
  Firestore,
  where,
};
