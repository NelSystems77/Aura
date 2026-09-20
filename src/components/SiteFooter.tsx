import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { formatPhoneDisplay } from "@/lib/format";
import { buildWhatsAppLink, buildGeneralWhatsAppMessage } from "@/lib/whatsapp";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-white/10 bg-[#0b0d10] text-white/70">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-12">
        <div>
          <p className="font-[family-name:var(--font-cinzel)] text-lg tracking-[0.28em] text-white">
            AURA
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/50">{settings.siteTagline}</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#c9a24b]">
            Explorar
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/caballero" className="hover:text-white">
                Zona Caballero
              </Link>
            </li>
            <li>
              <Link href="/dama" className="hover:text-white">
                Zona Dama
              </Link>
            </li>
            <li>
              <Link href="/ofertas" className="hover:text-white">
                Ofertas
              </Link>
            </li>
            <li>
              <Link href="/nuevos-ingresos" className="hover:text-white">
                Nuevos ingresos
              </Link>
            </li>
            <li>
              <Link href="/resenas" className="hover:text-white">
                Reseñas de clientes
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#c9a24b]">
            Contacto
          </p>
          <p className="text-sm text-white/60">Pedidos y consultas directas por WhatsApp</p>
          <a
            href={buildWhatsAppLink(settings.whatsappNumber, buildGeneralWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-semibold text-white hover:text-[#c9a24b]"
          >
            {formatPhoneDisplay(settings.whatsappNumber)}
          </a>
          {settings.whatsappNumberSecondary && (
            <>
              <p className="mt-3 text-sm text-white/60">También puedes escribirnos al</p>
              <a
                href={buildWhatsAppLink(settings.whatsappNumberSecondary, buildGeneralWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-white hover:text-[#c9a24b]"
              >
                {formatPhoneDisplay(settings.whatsappNumberSecondary)}
              </a>
            </>
          )}
          <div className="mt-3 flex gap-3 text-sm">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/30">
        © {new Date().getFullYear()} {settings.siteName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
