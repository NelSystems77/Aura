import { countProducts } from "@/lib/repo/products";
import { listSlides } from "@/lib/repo/carousel";

function StatCard({ label, value, accent = "#c9a24b" }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111318] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, slides] = await Promise.all([countProducts(), listSlides()]);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">
        Panel de administración
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Productos totales" value={stats.total} />
        <StatCard label="Caballero" value={stats.hombre} accent="#3d5a73" />
        <StatCard label="Dama" value={stats.mujer} accent="#93283a" />
        <StatCard label="En oferta" value={stats.onOffer} accent="#e4c988" />
        <StatCard label="Agotados" value={stats.outOfStock} accent="#f87171" />
        <StatCard label="Nuevos ingresos" value={stats.isNew} accent="#34d399" />
        <StatCard label="Destacados" value={stats.featured} />
        <StatCard label="Slides de carrusel" value={slides.length} />
      </div>

      <p className="mt-8 text-sm text-white/40">
        Usa el menú lateral para gestionar productos, el carrusel de inicio y los ajustes del
        sitio (WhatsApp, textos, redes sociales).
      </p>
    </div>
  );
}
