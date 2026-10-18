import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:demo-app',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const analytics =
  typeof window !== 'undefined' && firebaseConfig.measurementId
    ? getAnalytics(app)
    : null;

export async function addRsvp(payload) {
  await addDoc(collection(db, 'rsvps'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function addGuestbookMessage(payload) {
  await addDoc(collection(db, 'messages'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

async function getCollectionRecords(collectionName) {
  const result = await getDocs(query(collection(db, collectionName), orderBy('createdAt', 'desc')));
  return result.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export function getRsvps() {
  return getCollectionRecords('rsvps');
}

export function getGuestbookMessages() {
  return getCollectionRecords('messages');
}

export function subscribeToGuestbook(callback) {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    callback(items);
  });
}
