import Link from "next/link";
import { listReviews } from "@/lib/repo/reviews";
import { approveReviewAction, deleteReviewAction } from "@/lib/actions/review-actions";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status === "aprobadas" ? true : status === "pendientes" ? false : undefined;

  const reviews = await listReviews(filter === undefined ? {} : { approved: filter });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Reseñas ({reviews.length})
        </h1>
        <div className="flex gap-2">
          {[
            { key: undefined, label: "Todas" },
            { key: "pendientes", label: "Pendientes" },
            { key: "aprobadas", label: "Aprobadas" },
          ].map((f) => (
            <Link
              key={f.label}
              href={f.key ? `/admin/resenas?status=${f.key}` : "/admin/resenas"}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                status === f.key || (!status && !f.key)
                  ? "bg-[#c9a24b] text-black"
                  : "border border-white/15 text-white/70"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-white/40">No hay reseñas en esta vista.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#111318] p-4"
            >
              <div className="max-w-xl">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[#c9a24b]">{"★".repeat(r.rating)}</span>
                  <span className="text-white/20">{"★".repeat(5 - r.rating)}</span>
                  {!r.approved && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                      Pendiente
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/80">&ldquo;{r.comment}&rdquo;</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/40">
                  {r.customerName} · {new Date(r.createdAt).toLocaleDateString("es-CR")}
                </p>
              </div>
              <div className="flex gap-2">
                {!r.approved && (
                  <form action={approveReviewAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-full border border-emerald-400/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400 hover:bg-emerald-500/10">
                      Aprobar
                    </button>
                  </form>
                )}
                <form action={deleteReviewAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="rounded-full border border-red-500/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-red-400 hover:bg-red-500/10">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
