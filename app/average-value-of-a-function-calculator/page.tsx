import { CalculatorPageView } from "@/components/content/CalculatorPageView";
import { calculators } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";

const page = calculators["average-value-of-a-function-calculator"];

export const metadata = buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: "/average-value-of-a-function-calculator", absoluteTitle: true });

export default function Page() {
  return <CalculatorPageView page={page} />;
}
