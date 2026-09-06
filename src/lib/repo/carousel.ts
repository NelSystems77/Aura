import { getDb } from "@/lib/db";
import type { CarouselSlide, CarouselSlideInput, GenderTheme } from "@/lib/types";

type SlideRow = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string | null;
  link_url: string;
  cta_label: string;
  gender_theme: string;
  sort_order: number;
  active: number;
  created_at: string;
  updated_at: string;
};

function rowToSlide(row: SlideRow): CarouselSlide {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    linkUrl: row.link_url,
    ctaLabel: row.cta_label,
    genderTheme: row.gender_theme as GenderTheme,
    sortOrder: row.sort_order,
    active: !!row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listSlides(onlyActive = false): CarouselSlide[] {
  const db = getDb();
  const rows = (
    onlyActive
      ? db.prepare("SELECT * FROM carousel_slides WHERE active = 1 ORDER BY sort_order ASC").all()
      : db.prepare("SELECT * FROM carousel_slides ORDER BY sort_order ASC").all()
  ) as SlideRow[];
  return rows.map(rowToSlide);
}

export function getSlideById(id: number): CarouselSlide | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM carousel_slides WHERE id = ?").get(id) as
    | SlideRow
    | undefined;
  return row ? rowToSlide(row) : null;
}

export function insertSlide(input: CarouselSlideInput): CarouselSlide {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO carousel_slides (title, subtitle, image_url, link_url, cta_label, gender_theme, sort_order, active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
    .run(
      input.title,
      input.subtitle ?? "",
      input.imageUrl ?? null,
      input.linkUrl ?? "/",
      input.ctaLabel ?? "Ver más",
      input.genderTheme,
      input.sortOrder ?? 0,
      input.active ? 1 : 0
    );
  return getSlideById(Number(info.lastInsertRowid))!;
}

export function updateSlide(id: number, input: Partial<CarouselSlideInput>): CarouselSlide | null {
  const current = getSlideById(id);
  if (!current) return null;
  const merged = {
    title: input.title ?? current.title,
    subtitle: input.subtitle ?? current.subtitle,
    imageUrl: input.imageUrl !== undefined ? input.imageUrl : current.imageUrl,
    linkUrl: input.linkUrl ?? current.linkUrl,
    ctaLabel: input.ctaLabel ?? current.ctaLabel,
    genderTheme: input.genderTheme ?? current.genderTheme,
    sortOrder: input.sortOrder ?? current.sortOrder,
    active: input.active !== undefined ? input.active : current.active,
  };
  const db = getDb();
  db.prepare(
    `UPDATE carousel_slides SET title=?, subtitle=?, image_url=?, link_url=?, cta_label=?, gender_theme=?, sort_order=?, active=?, updated_at=datetime('now') WHERE id=?`
  ).run(
    merged.title,
    merged.subtitle,
    merged.imageUrl ?? null,
    merged.linkUrl,
    merged.ctaLabel,
    merged.genderTheme,
    merged.sortOrder,
    merged.active ? 1 : 0,
    id
  );
  return getSlideById(id);
}

export function deleteSlide(id: number): void {
  const db = getDb();
  db.prepare("DELETE FROM carousel_slides WHERE id = ?").run(id);
}
