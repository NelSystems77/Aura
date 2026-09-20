import type { Metadata } from "next";
import { listReviews } from "@/lib/repo/reviews";
import { getSettings } from "@/lib/repo/settings";
import { Container } from "@/components/ui/Container";
import { ShareExperienceLinks } from "@/components/ShareExperienceLinks";
import { ReviewForm } from "@/components/ReviewForm";
import { StarRatingDisplay } from "@/components/StarRating";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reseñas de clientes",
  description:
    "Lee lo que opinan nuestros clientes de AURA Perfumería y comparte tu propia experiencia por WhatsApp, Instagram, Facebook o directo en el sitio.",
};

export default async function ResenasPage() {
  const [settings, approved] = await Promise.all([
    getSettings(),
    listReviews({ approved: true }),
  ]);

  const jsonLd =
    approved.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: settings.siteName,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
            ).toFixed(1),
            reviewCount: approved.length,
          },
          review: approved.slice(0, 20).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.customerName },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.comment,
            datePublished: r.createdAt.slice(0, 10),
          })),
        }
      : null;

  return (
    <div className="zone-hombre min-h-screen">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="luxury-grain border-b zone-border py-16 text-center sm:py-20">
        <Container>
          <p className="zone-accent-text text-xs font-bold uppercase tracking-[0.3em]">
            Tu opinión importa
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold sm:text-5xl">
            Comparte tu experiencia con AURA
          </h1>
          <p className="zone-muted-text mx-auto mt-4 max-w-xl text-base">
            Cuéntanos cómo te fue con tu pedido — nos ayuda a mejorar y le sirve a otros
            clientes. Puedes dejarla aquí mismo o en tu red favorita.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <ShareExperienceLinks settings={settings} />
      </Container>

      <Container className="grid gap-10 pb-16 sm:grid-cols-2 sm:pb-24">
        <ReviewForm />
        <div>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-semibold">
            Lo que dicen nuestros clientes
          </h2>
          <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
            {approved.length === 0 ? (
              <p className="zone-muted-text text-sm">
                Todavía no hay reseñas publicadas. ¡Sé el primero en compartir tu experiencia!
              </p>
            ) : (
              approved.map((review) => (
                <div key={review.id} className="rounded-2xl border zone-border zone-surface p-5">
                  <StarRatingDisplay rating={review.rating} />
                  <p className="zone-muted-text mt-3 text-sm leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide zone-accent-text">
                    {review.customerName}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
