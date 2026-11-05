/**
 * Read-only star rating. Screen readers hear "Rated 4 out of 5".
 *
 * Drawn as a single element: a five-star mask (the `.stars` class in app/globals.css) over a
 * two-colour gradient whose split point is the rating. That keeps each rating to one short tag
 * instead of ten SVGs, which matters on pages that show many review cards.
 */
export function Stars({ rating, size = "h-4", className }: { rating: number; size?: string; className?: string }) {
  const rounded = Math.round(rating * 2) / 2;
  // Only the height classes matter: the width follows from the 5:1 aspect ratio.
  const height = size
    .split(/\s+/)
    .filter((c) => /(^|:)h-/.test(c))
    .join(" ");
  return (
    <span
      role="img"
      aria-label={`Rated ${Number.isInteger(rating) ? rating : rating.toFixed(1)} out of 5`}
      className={`stars inline-block aspect-[5/1] align-middle ${height || "h-4"} ${className ?? ""}`}
      style={{ "--stars-fill": `${(rounded / 5) * 100}%` } as React.CSSProperties}
    />
  );
}
