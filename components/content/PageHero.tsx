import type { Crumb } from "./Breadcrumbs";
import { Breadcrumbs } from "./Breadcrumbs";

/** Navy page header used by text pages, the FAQ and the reviews page. */
export function PageHero({
  crumbs,
  eyebrow,
  icon,
  title,
  children,
  meta,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  icon?: React.ReactNode;
  title: string;
  /** Lead paragraph(s). */
  children?: React.ReactNode;
  /** Small line under the lead, e.g. "Last updated". */
  meta?: React.ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden bg-navy-gradient pb-24 pt-8 text-white sm:pt-10">
      <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#923eff]/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#4c22c9]/30 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {crumbs && <Breadcrumbs items={crumbs} tone="dark" />}
        {eyebrow && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/15">
            {icon && <span aria-hidden className="text-[#c9a8ff] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
            {eyebrow}
          </p>
        )}
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.1rem,4.8vw,3.3rem)] font-extrabold leading-[1.1] tracking-tight">{title}</h1>
        {children && <div className="mt-4 max-w-2xl space-y-3 text-lg leading-relaxed text-white/80 [&_a]:font-semibold [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2">{children}</div>}
        {meta && <div className="mt-5 text-sm text-white/70">{meta}</div>}
      </div>
    </div>
  );
}
