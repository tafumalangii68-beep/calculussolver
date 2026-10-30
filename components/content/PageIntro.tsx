import type { Crumb } from "./Breadcrumbs";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageIntro({ crumbs, title, children }: { crumbs?: Crumb[]; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">{title}</h1>
      {children && <div className="mt-4 text-lg text-ink-soft">{children}</div>}
    </div>
  );
}
