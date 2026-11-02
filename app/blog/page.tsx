import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PageIntro } from "@/components/content/PageIntro";
import { formatDate } from "@/components/content/ProsePage";
import { posts } from "@/data/blog";
import { buildMetadata, webPageLd } from "@/lib/seo";

const description = "Step-by-step calculus tutorials from Calculus Solver: how to find derivatives, integrals and limits, with worked examples you can check.";

export const metadata = buildMetadata({ title: "Calculus Blog", description, path: "/blog" });

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <JsonLd data={webPageLd("Calculus Blog", "/blog", description)} />
      <PageIntro crumbs={[{ name: "Blog", path: "/blog" }]} title="Calculus Blog">
        <p>
          Step-by-step tutorials for common calculus questions. For reference material, see the{" "}
          <Link href="/guides" className="text-accent-strong underline underline-offset-2">study guides</Link>.
        </p>
      </PageIntro>
      <ul className="mt-10 grid max-w-3xl grid-cols-1 gap-4">
        {sorted.map((post) => (
          <li key={post.slug}>
            <article className="rounded-card border border-line bg-surface p-6 transition-colors hover:border-accent">
              {post.published && (
                <p className="text-sm text-muted">
                  <time dateTime={post.published}>{formatDate(post.published)}</time>
                </p>
              )}
              <h2 className="mt-1 font-serif text-xl font-semibold text-ink">
                <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-4">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-ink-soft">{post.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
