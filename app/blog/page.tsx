import { BLOG_DESCRIPTION, BlogIndex } from "@/components/content/BlogIndex";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Calculus Blog", description: BLOG_DESCRIPTION, path: "/blog" });

export default function BlogPage() {
  return <BlogIndex />;
}
