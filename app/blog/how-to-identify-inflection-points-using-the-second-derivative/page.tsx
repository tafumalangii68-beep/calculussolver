import { GuideView } from "@/components/content/GuideView";
import { getPost } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

const post = getPost("how-to-identify-inflection-points-using-the-second-derivative")!;
const path = `/blog/${post.slug}`;

export const metadata = buildMetadata({ title: post.metaTitle, description: post.description, path, absoluteTitle: true, type: "article" });

export default function Page() {
  return <GuideView guide={post} collection={{ name: "Blog", path: "/blog" }} />;
}
