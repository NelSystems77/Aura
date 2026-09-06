import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso administrador",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_120%_at_50%_0%,#1c2129_0%,#0b0d10_60%)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111318] p-8 shadow-2xl">
        <p className="text-center font-[family-name:var(--font-cinzel)] text-2xl tracking-[0.3em] text-[#c9a24b]">
          AURA
        </p>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.2em] text-white/40">
          Panel de administración
        </p>

        <LoginForm nextPath={next || "/admin"} />
      </div>
    </div>
  );
}
