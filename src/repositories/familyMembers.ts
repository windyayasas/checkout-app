import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';

export interface FamilyMember {
  id: string; // document id
  familyId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  createdAt: number;
  updatedAt: number;
}

const familyMembersCol = collection(db, 'familyMembers');

export async function addFamilyMember(data: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: FamilyMember['status'] }) {
  const ref = await addDoc(familyMembersCol, { ...data, status: data.status || 'active', createdAt: Date.now(), updatedAt: Date.now() });
  return ref.id;
}

export async function updateFamilyMember(id: string, patch: Partial<Omit<FamilyMember, 'id'>>) {
  await updateDoc(doc(familyMembersCol, id), { ...patch, updatedAt: Date.now() });
}

export async function removeFamilyMember(id: string) {
  await deleteDoc(doc(familyMembersCol, id));
}

export async function listMembers(familyId: string): Promise<FamilyMember[]> {
  const q = query(familyMembersCol, where('familyId', '==', familyId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function subscribeMembers(familyId: string, cb: (members: FamilyMember[]) => void): () => void {
  const q = query(familyMembersCol, where('familyId', '==', familyId));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))));
}
