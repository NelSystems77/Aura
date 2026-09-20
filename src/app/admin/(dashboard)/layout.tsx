import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import { countPendingReviews } from "@/lib/repo/reviews";

const NAV = [
  { href: "/admin", label: "Panel", icon: "📊" },
  { href: "/admin/productos", label: "Productos", icon: "🧴" },
  { href: "/admin/carrusel", label: "Carrusel", icon: "🎞️" },
  { href: "/admin/resenas", label: "Reseñas", icon: "⭐" },
  { href: "/admin/ajustes", label: "Ajustes", icon: "⚙️" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const pendingReviews = await countPendingReviews();

  return (
    <div className="flex min-h-screen bg-[#0b0d10] text-[#f2efe9]">
      <aside className="hidden w-60 flex-none flex-col border-r border-white/10 bg-[#111318] p-5 sm:flex">
        <p className="mb-8 font-[family-name:var(--font-cinzel)] text-lg tracking-[0.28em] text-[#c9a24b]">
          AURA
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span>{item.icon}</span>
              {item.label}
              {item.href === "/admin/resenas" && pendingReviews > 0 && (
                <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  {pendingReviews}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="mb-2 truncate text-xs text-white/40">{admin.email}</p>
          <form action={logoutAction}>
            <button className="w-full rounded-full border border-white/15 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 hover:border-red-400 hover:text-red-400">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#111318] px-5 py-3 sm:hidden">
          <p className="font-[family-name:var(--font-cinzel)] tracking-[0.28em] text-[#c9a24b]">AURA</p>
          <form action={logoutAction}>
            <button className="text-xs text-white/60">Salir</button>
          </form>
        </header>
        <nav className="flex gap-4 overflow-x-auto border-b border-white/10 bg-[#111318] px-5 py-2 text-xs sm:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap text-white/70">
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
