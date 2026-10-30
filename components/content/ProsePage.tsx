import { webPageLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";
import { PageIntro } from "./PageIntro";

/** Layout for text pages such as the legal pages, About and How It Works. */
export function ProsePage({
  title,
  path,
  description,
  updated,
  lead,
  children,
}: {
  title: string;
  path: string;
  description: string;
  updated?: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <JsonLd data={webPageLd(title, path, description)} />
      <PageIntro crumbs={[{ name: title, path }]} title={title}>
        {lead}
        {updated && (
          <p className="mt-3 text-sm text-muted">
            Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
        )}
      </PageIntro>
      <div className="prose-body mt-10">{children}</div>
    </div>
  );
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[m - 1]} ${d}, ${y}`;
}
