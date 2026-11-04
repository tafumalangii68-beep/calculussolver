/** Centered section heading: small eyebrow pill, title with an optional gradient highlight, subtitle. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  highlight,
  children,
  align = "center",
}: {
  id: string;
  eyebrow?: string;
  /** Plain part of the title. */
  title: string;
  /** Words after the title shown in the brand gradient. */
  highlight?: string;
  /** Subtitle. */
  children?: React.ReactNode;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">
          <span aria-hidden>✦</span>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={`font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-extrabold leading-[1.15] tracking-tight text-ink ${eyebrow ? "mt-4" : ""}`}>
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-heading-gradient">{highlight}</span>
          </>
        )}
      </h2>
      {children && <div className={`mt-3 text-base leading-relaxed text-muted sm:text-lg ${center ? "mx-auto max-w-2xl" : ""}`}>{children}</div>}
    </div>
  );
}
