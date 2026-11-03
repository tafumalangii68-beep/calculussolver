import { CalculatorPageView } from "@/components/content/CalculatorPageView";
import { calculators } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";

const page = calculators["chain-rule-calculator"];

export const metadata = buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: "/chain-rule-calculator", absoluteTitle: true });

export default function Page() {
  return <CalculatorPageView page={page} />;
}
