import type { Review } from "@/lib/types";
import { StarRatingDisplay } from "@/components/StarRating";

export function ReviewsList({
  reviews,
  emptyMessage = "Todavía no hay reseñas publicadas. ¡Sé el primero en compartir tu experiencia!",
}: {
  reviews: Review[];
  emptyMessage?: string;
}) {
  if (reviews.length === 0) {
    return <p className="zone-muted-text py-10 text-center text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl border zone-border zone-surface p-5">
          <StarRatingDisplay rating={review.rating} />
          <p className="zone-muted-text mt-3 text-sm leading-relaxed">"{review.comment}"</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide zone-accent-text">
            {review.customerName}
          </p>
        </div>
      ))}
    </div>
  );
}
