import { Star } from "lucide-react";

/** Read-only star rating. Screen readers hear "Rated 4 out of 5". */
export function Stars({ rating, size = "h-4 w-4", className }: { rating: number; size?: string; className?: string }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span role="img" aria-label={`Rated ${Number.isInteger(rating) ? rating : rating.toFixed(1)} out of 5`} className={`inline-flex items-center gap-0.5 ${className ?? ""}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = rounded >= i ? "full" : rounded >= i - 0.5 ? "half" : "empty";
        return (
          <span key={i} aria-hidden className={`relative ${size}`}>
            <Star className={`absolute inset-0 ${size} fill-star-empty text-star-empty`} strokeWidth={1.5} />
            {fill !== "empty" && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: fill === "half" ? "50%" : "100%" }}>
                <Star className={`${size} fill-star text-star-stroke`} strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
