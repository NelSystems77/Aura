import { getSettings } from "@/lib/repo/settings";
import { listSlides } from "@/lib/repo/carousel";
import { listProducts } from "@/lib/repo/products";
import { HomeCarousel } from "@/components/HomeCarousel";
import { ZoneSelector } from "@/components/ZoneSelector";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

const VALUE_PROPS = [
  {
    icon: "💬",
    title: "Compra 100% por WhatsApp",
    text: "Sin registros ni carritos: escríbenos y coordinamos tu pedido al instante.",
  },
  {
    icon: "🚚",
    title: "Entrega en todo Costa Rica",
    text: "Coordinación rápida de envío o retiro según tu ubicación.",
  },
  {
    icon: "✅",
    title: "Fragancias originales",
    text: "Catálogo curado de marcas reconocidas, con disponibilidad verificada.",
  },
  {
    icon: "💳",
    title: "Pago flexible",
    text: "SINPE Móvil, efectivo o depósito bancario, como prefieras.",
  },
];

export default async function HomePage() {
  const settings = getSettings();
  const slides = listSlides(true);

  const onOffer = listProducts({ available: true, onOffer: true }).slice(0, 10);
  const featured = listProducts({ available: true, featured: true }).slice(0, 10);
  const isNew = listProducts({ available: true, isNew: true }).slice(0, 10);

  const heroSlides =
    slides.length > 0
      ? slides
      : [
          {
            id: 0,
            title: settings.heroTitleHombre,
            subtitle: settings.heroSubtitleHombre,
            imageUrl: null,
            linkUrl: "/caballero",
            ctaLabel: "Explorar Caballero",
            genderTheme: "hombre" as const,
            sortOrder: 0,
            active: true,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: -1,
            title: settings.heroTitleMujer,
            subtitle: settings.heroSubtitleMujer,
            imageUrl: null,
            linkUrl: "/dama",
            ctaLabel: "Explorar Dama",
            genderTheme: "mujer" as const,
            sortOrder: 1,
            active: true,
            createdAt: "",
            updatedAt: "",
          },
        ];

  return (
    <div className="zone-hombre">
      <HomeCarousel slides={heroSlides} />

      <Container className="py-16 sm:py-20">
        <SectionHeading eyebrow="Elige tu universo" title="Dos mundos, una misma exclusividad" />
        <ZoneSelector />
      </Container>

      {featured.length > 0 && (
        <div className="border-t zone-border py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Selección AURA" title="Destacados de la casa" />
            <ProductGrid products={featured} whatsappNumber={settings.whatsappNumber} />
          </Container>
        </div>
      )}

      {onOffer.length > 0 && (
        <div className="border-t zone-border py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Por tiempo limitado" title="Ofertas exclusivas" href="/ofertas" />
            <ProductGrid products={onOffer} whatsappNumber={settings.whatsappNumber} />
          </Container>
        </div>
      )}

      {isNew.length > 0 && (
        <div className="border-t zone-border py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Recién llegados" title="Nuevos ingresos" href="/nuevos-ingresos" />
            <ProductGrid products={isNew} whatsappNumber={settings.whatsappNumber} />
          </Container>
        </div>
      )}

      <div className="border-t zone-border py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="rounded-2xl border zone-border zone-surface p-6">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold">
                  {v.title}
                </h3>
                <p className="zone-muted-text mt-2 text-sm">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
