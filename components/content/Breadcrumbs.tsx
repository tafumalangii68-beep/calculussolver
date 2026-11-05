import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. Home is added automatically. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  const dark = tone === "dark";
  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-sm ${dark ? "text-white/65" : "text-muted"}`}>
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className={dark ? "text-white" : "text-ink-soft"}>
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className={`inline-flex min-h-6 items-center underline-offset-2 hover:underline ${dark ? "hover:text-white" : "hover:text-ink"}`}>
                      {item.name}
                    </Link>
                    <ChevronRight aria-hidden className="h-3.5 w-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}
