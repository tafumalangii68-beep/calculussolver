import type { Crumb } from "./Breadcrumbs";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageIntro({
  crumbs,
  title,
  titleClass = "text-ink",
  children,
}: {
  crumbs?: Crumb[];
  title: string;
  /** Colour class for the H1; calculator pages use their own colour. */
  titleClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <h1 className={`mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl ${titleClass}`}>{title}</h1>
      {children && <div className="mt-4 text-lg text-ink-soft">{children}</div>}
    </div>
  );
}
