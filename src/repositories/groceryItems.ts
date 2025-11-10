import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

const itemsCol = collection(db, 'groceryItems');

export interface GroceryItem {
  id: string;
  familyId: string;
  name: string;
  quantity: number;
  unit: string;
  brand?: string;
  price?: number;
  checked?: boolean;
  createdAt: number;
  updatedAt: number;
}

export async function addItem(data: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(itemsCol, {
    ...data,
    checked: data.checked ?? false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return ref.id;
}

export async function updateItem(id: string, patch: Partial<Omit<GroceryItem, 'id' | 'familyId'>>) {
  await updateDoc(doc(itemsCol, id), { ...patch, updatedAt: Date.now() });
}

export async function deleteItem(id: string) {
  await deleteDoc(doc(itemsCol, id));
}

export async function listItemsByFamily(familyId: string): Promise<GroceryItem[]> {
  const q = query(itemsCol, where('familyId', '==', familyId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function subscribeItems(familyId: string, cb: (items: GroceryItem[]) => void): () => void {
  const q = query(itemsCol, where('familyId', '==', familyId));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  });
}
