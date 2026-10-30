import { GuideView } from "@/components/content/GuideView";
import { getGuide } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

const guide = getGuide("derivative-rules")!;

export const metadata = buildMetadata({ title: guide.metaTitle, description: guide.description, path: "/guides/derivative-rules", absoluteTitle: true, type: "article" });

export default function Page() {
  return <GuideView guide={guide} />;
}
