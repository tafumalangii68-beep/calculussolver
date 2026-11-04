import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_DESCRIPTION, BlogIndex } from "@/components/content/BlogIndex";
import { pageCount, pageHref } from "@/components/content/Pagination";
import { posts } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

// Pages 2, 3, … of the blog listing. Only pages that have posts exist; everything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: pageCount(posts.length) - 1 }, (_, i) => ({ page: String(i + 2) }));
}

const parse = (raw: string) => {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 2 && n <= pageCount(posts.length) ? n : null;
};

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const n = parse((await params).page);
  if (!n) return {};
  return buildMetadata({ title: `Calculus Blog – Page ${n}`, description: BLOG_DESCRIPTION, path: pageHref("/blog", n) });
}

export default async function BlogPageN({ params }: { params: Promise<{ page: string }> }) {
  const n = parse((await params).page);
  if (!n) notFound();
  return <BlogIndex page={n} />;
}
