import Link from "next/link";
import { listSlides } from "@/lib/repo/carousel";
import { deleteSlideAction } from "@/lib/actions/carousel-actions";

export default async function AdminCarouselPage() {
  const slides = await listSlides();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Carrusel de inicio
        </h1>
        <Link
          href="/admin/carrusel/nuevo"
          className="rounded-full bg-[#c9a24b] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-black hover:brightness-110"
        >
          + Nueva diapositiva
        </Link>
      </div>

      {slides.length === 0 ? (
        <p className="text-sm text-white/40">
          Aún no hay diapositivas. Mientras tanto, el inicio muestra un carrusel por defecto con
          Caballero y Dama.
        </p>
      ) : (
        <div className="space-y-3">
          {slides.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111318] p-4"
            >
              <div>
                <p className="font-semibold text-white">{s.title}</p>
                <p className="text-xs text-white/40">
                  {s.subtitle} · Orden {s.sortOrder} ·{" "}
                  {s.genderTheme === "hombre" ? "Caballero" : s.genderTheme === "mujer" ? "Dama" : "General"}{" "}
                  · {s.active ? "Activa" : "Inactiva"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/carrusel/${s.id}`}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white/70 hover:border-[#c9a24b] hover:text-[#c9a24b]"
                >
                  Editar
                </Link>
                <form action={deleteSlideAction}>
                  <input type="hidden" name="id" value={s.id} />
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
