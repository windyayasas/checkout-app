import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

const familiesCol = collection(db, 'families');

export interface Family {
  id: string;
  name: string;
  currency: string;
  ownerId: string;
  createdAt: number;
}

export async function createFamily(data: Omit<Family, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(familiesCol, { ...data, createdAt: Date.now() });
  return ref.id;
}

export async function getFamily(id: string): Promise<Family | null> {
  const snap = await getDoc(doc(familiesCol, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Family, 'id'>) };
}

export async function listFamiliesByOwner(ownerId: string): Promise<Family[]> {
  const q = query(familiesCol, where('ownerId', '==', ownerId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export async function updateFamily(id: string, patch: Partial<Omit<Family, 'id'>>) {
  await updateDoc(doc(familiesCol, id), patch as any);
}

export async function deleteFamily(id: string) {
  await deleteDoc(doc(familiesCol, id));
}

export function subscribeFamilies(ownerId: string, cb: (families: Family[]) => void): () => void {
  const q = query(familiesCol, where('ownerId', '==', ownerId));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  });
}
