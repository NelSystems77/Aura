import type { SiteSettings } from "@/lib/types";
import { buildWhatsAppLink, buildReviewWhatsAppMessage } from "@/lib/whatsapp";

function facebookReviewsUrl(pageUrl: string): string {
  return pageUrl.replace(/\/+$/, "") + "/reviews";
}

export function ShareExperienceLinks({ settings }: { settings: SiteSettings }) {
  const links = [
    settings.whatsappNumber && {
      label: "Escríbenos por WhatsApp",
      href: buildWhatsAppLink(settings.whatsappNumber, buildReviewWhatsAppMessage()),
      icon: "💬",
      bg: "bg-[#25D366]",
    },
    settings.instagramUrl && {
      label: "Cuéntanos en Instagram",
      href: settings.instagramUrl,
      icon: "📸",
      bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]",
    },
    settings.facebookUrl && {
      label: "Déjanos tu reseña en Facebook",
      href: facebookReviewsUrl(settings.facebookUrl),
      icon: "👍",
      bg: "bg-[#1877F2]",
    },
  ].filter(Boolean) as { label: string; href: string; icon: string; bg: string }[];

  if (links.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${link.bg}`}
        >
          <span>{link.icon}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}
