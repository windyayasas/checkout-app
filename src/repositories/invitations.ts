import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';

export interface Invitation {
  id: string;
  familyId: string;
  email: string; // target email to invite
  senderId: string; // user who sent the invitation
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
  updatedAt: number;
}

const invitationsCol = collection(db, 'invitations');

export async function createInvitation(data: Omit<Invitation, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
  const ref = await addDoc(invitationsCol, { ...data, status: 'pending', createdAt: Date.now(), updatedAt: Date.now() });
  return ref.id;
}

export async function updateInvitation(id: string, patch: Partial<Omit<Invitation, 'id'>>) {
  await updateDoc(doc(invitationsCol, id), { ...patch, updatedAt: Date.now() });
}

export async function deleteInvitation(id: string) {
  await deleteDoc(doc(invitationsCol, id));
}

export async function listInvitationsForFamily(familyId: string): Promise<Invitation[]> {
  const q = query(invitationsCol, where('familyId', '==', familyId));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function subscribeInvitations(familyId: string, cb: (invites: Invitation[]) => void): () => void {
  const q = query(invitationsCol, where('familyId', '==', familyId));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))));
}
