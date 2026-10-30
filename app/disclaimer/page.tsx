import Link from "next/link";
import { ProsePage } from "@/components/content/ProsePage";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description = "Calculus Solver is an educational tool. Results may contain errors or appear in an equivalent form, and should be checked before you rely on them.";

export const metadata = buildMetadata({ title: "Disclaimer", description, path: "/disclaimer" });

export default function DisclaimerPage() {
  return (
    <ProsePage title="Disclaimer" path="/disclaimer" description={description} updated={siteConfig.legalUpdated}>
      <h2>Educational purpose</h2>
      <p>
        {siteConfig.name} is an educational tool, provided for general information and learning. It helps you explore calculus,
        check your own work and see how standard techniques are applied.
      </p>

      <h2>Results may contain errors</h2>
      <p>
        The solver uses documented methods and checks its own answers, but computer algebra is difficult. Results and steps can
        occasionally be wrong or incomplete. In particular:
      </p>
      <ul>
        <li>an answer may be written in a different but equivalent form from your textbook&apos;s;</li>
        <li>antiderivatives are unique only up to a constant, shown as + C;</li>
        <li>numerical results (marked ≈) are approximations, typically to about 10 significant digits;</li>
        <li>some limits are estimated numerically and clearly labelled as such;</li>
        <li>critical points are searched only within the interval you specify.</li>
      </ul>
      <p>Please check results, especially when they matter.</p>

      <h2>Not a substitute for instruction or professional advice</h2>
      <p>
        The website is not a substitute for a teacher, tutor or textbook. It provides no professional, engineering, financial,
        medical or legal advice. Do not rely on it for critical engineering, financial, safety or other high-stakes decisions.
      </p>

      <h2>No affiliation</h2>
      <p>
        {siteConfig.name} is an independent project. It is not affiliated with, or endorsed by, the College Board, any school,
        university, textbook publisher or exam board.
      </p>

      <h2>Your responsibility</h2>
      <p>
        You are responsible for how you use the results, including following your school&apos;s rules on calculators and
        academic integrity. See the <Link href="/terms-and-conditions">Terms and Conditions</Link>.
      </p>
    </ProsePage>
  );
}
