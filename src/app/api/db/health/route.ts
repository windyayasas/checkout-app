import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, limit, query, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    // Lightweight read to confirm Firestore initialized.
    const q = query(collection(db, 'families'), limit(1));
    await getDocs(q); // ignore result
    return NextResponse.json({ ok: true, service: 'firestore', timestamp: Date.now() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
