"use client";

import { buildWhatsAppLink, buildGeneralWhatsAppMessage } from "@/lib/whatsapp";

export function WhatsAppFloatingButton({ whatsappNumber }: { whatsappNumber: string }) {
  const href = buildWhatsAppLink(whatsappNumber, buildGeneralWhatsAppMessage());

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-transform hover:scale-110 active:scale-95 sm:bottom-8 sm:right-8"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.727-1.87A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3Zm0 21.6c-1.94 0-3.75-.55-5.286-1.5l-.379-.226-4.585 1.11 1.135-4.47-.246-.386A9.57 9.57 0 0 1 6.4 15c0-5.302 4.298-9.6 9.601-9.6 5.302 0 9.6 4.298 9.6 9.6 0 5.302-4.298 9.6-9.6 9.6Zm5.29-7.19c-.29-.145-1.71-.844-1.976-.94-.265-.096-.458-.145-.652.145-.193.29-.748.94-.916 1.135-.169.193-.338.217-.628.072-.29-.145-1.223-.451-2.33-1.44-.862-.769-1.444-1.719-1.613-2.01-.169-.29-.018-.446.127-.59.13-.13.29-.338.435-.507.145-.169.193-.29.29-.483.096-.193.048-.362-.024-.507-.072-.145-.652-1.572-.894-2.153-.235-.564-.474-.488-.652-.497l-.556-.01c-.193 0-.507.072-.773.362-.265.29-1.014.99-1.014 2.417 0 1.427 1.038 2.805 1.183 2.998.145.193 2.043 3.12 4.949 4.374.691.298 1.23.476 1.65.61.693.22 1.324.189 1.823.115.556-.083 1.71-.699 1.951-1.373.241-.675.241-1.253.169-1.373-.072-.12-.265-.193-.556-.338Z" />
      </svg>
      <span className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-black/85 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
        Escríbenos por WhatsApp
      </span>
    </a>
  );
}
