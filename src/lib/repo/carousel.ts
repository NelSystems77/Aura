import "server-only";
import { getAdminDb } from "@/lib/firebase-admin";
import type { CarouselSlide, CarouselSlideInput } from "@/lib/types";

const COLLECTION = "carouselSlides";

type SlideDoc = Omit<CarouselSlide, "id">;

function docToSlide(
  doc: FirebaseFirestore.DocumentSnapshot | FirebaseFirestore.QueryDocumentSnapshot
): CarouselSlide | null {
  if (!doc.exists) return null;
  const data = doc.data() as SlideDoc;
  return { id: doc.id, ...data };
}

export async function listSlides(onlyActive = false): Promise<CarouselSlide[]> {
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION).get();
  let slides = snapshot.docs
    .map(docToSlide)
    .filter((s): s is CarouselSlide => s !== null);
  if (onlyActive) slides = slides.filter((s) => s.active);
  return slides.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSlideById(id: string): Promise<CarouselSlide | null> {
  const db = getAdminDb();
  const doc = await db.collection(COLLECTION).doc(id).get();
  return docToSlide(doc);
}

export async function insertSlide(input: CarouselSlideInput): Promise<CarouselSlide> {
  const db = getAdminDb();
  const now = new Date().toISOString();
  const doc: SlideDoc = {
    title: input.title,
    subtitle: input.subtitle ?? "",
    imageUrl: input.imageUrl ?? null,
    linkUrl: input.linkUrl ?? "/",
    ctaLabel: input.ctaLabel ?? "Ver más",
    genderTheme: input.genderTheme,
    sortOrder: input.sortOrder ?? 0,
    active: input.active,
    createdAt: now,
    updatedAt: now,
  };
  const ref = await db.collection(COLLECTION).add(doc);
  return { id: ref.id, ...doc };
}

export async function updateSlide(
  id: string,
  input: Partial<CarouselSlideInput>
): Promise<CarouselSlide | null> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(id);
  const current = await ref.get();
  if (!current.exists) return null;

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) patch[key] = value;
  }

  await ref.update(patch);
  const updated = await ref.get();
  return docToSlide(updated);
}

export async function deleteSlide(id: string): Promise<void> {
  const db = getAdminDb();
  await db.collection(COLLECTION).doc(id).delete();
}
