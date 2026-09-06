import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listProducts } from "@/lib/repo/products";
import { createProductSearchIndex, smartSearch } from "@/lib/search";
import type { Gender } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const genderParam = searchParams.get("gender");
  const gender = genderParam === "hombre" || genderParam === "mujer" ? (genderParam as Gender) : undefined;

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const products = listProducts(gender ? { gender } : {});
  const index = createProductSearchIndex(products);
  const results = smartSearch(products, index, q).slice(0, 24);

  return NextResponse.json({
    results: results.map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      gender: p.gender,
      currentPrice: p.currentPrice,
      regularPrice: p.regularPrice,
      available: p.available,
      onOffer: p.onOffer,
      tags: p.tags,
    })),
  });
}
