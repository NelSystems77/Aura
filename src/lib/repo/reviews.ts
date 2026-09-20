import "server-only";
import { getAdminDb } from "@/lib/firebase-admin";
import type { Review, ReviewInput } from "@/lib/types";

const COLLECTION = "reviews";

type ReviewDoc = Omit<Review, "id">;

function docToReview(
  doc: FirebaseFirestore.DocumentSnapshot | FirebaseFirestore.QueryDocumentSnapshot
): Review | null {
  if (!doc.exists) return null;
  const data = doc.data() as ReviewDoc;
  return { id: doc.id, ...data };
}

function sortNewestFirst(list: Review[]): Review[] {
  return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listReviews(filters: { approved?: boolean } = {}): Promise<Review[]> {
  const db = getAdminDb();
  const base =
    filters.approved !== undefined
      ? db.collection(COLLECTION).where("approved", "==", filters.approved)
      : db.collection(COLLECTION);
  const snapshot = await base.get();
  const list = snapshot.docs.map(docToReview).filter((r): r is Review => r !== null);
  return sortNewestFirst(list);
}

export async function countPendingReviews(): Promise<number> {
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION).where("approved", "==", false).count().get();
  return snapshot.data().count;
}

export async function insertReview(input: ReviewInput): Promise<Review> {
  const db = getAdminDb();
  const now = new Date().toISOString();
  const doc: ReviewDoc = {
    customerName: input.customerName,
    rating: input.rating,
    comment: input.comment,
    approved: false,
    createdAt: now,
  };
  const ref = await db.collection(COLLECTION).add(doc);
  return { id: ref.id, ...doc };
}

export async function approveReview(id: string): Promise<void> {
  const db = getAdminDb();
  await db.collection(COLLECTION).doc(id).update({ approved: true });
}

export async function deleteReview(id: string): Promise<void> {
  const db = getAdminDb();
  await db.collection(COLLECTION).doc(id).delete();
}
