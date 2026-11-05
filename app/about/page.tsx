import Link from "next/link";
import { StudyDesk } from "@/components/content/Illustrations";
import { FeatureGrid, TrustGrid } from "@/components/content/InfoSections";
import { ProsePage } from "@/components/content/ProsePage";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description = "What Calculus Solver is, who it is for, how its answers are checked, and the principles behind it: accuracy, privacy and learning first.";

export const metadata = buildMetadata({ title: "About Us", description, path: "/about" });

export default function AboutPage() {
  return (
    <ProsePage
      title="About Us"
      path="/about"
      description={description}
      after={
        <>
          <FeatureGrid />
          <TrustGrid />
        </>
      }
      lead={<p>{siteConfig.name} is an independent educational project: a free calculus solver that shows its work and keeps your data on your device.</p>}
    >
      <StudyDesk />

      <h2>What we built and why</h2>
      <p>
        Many calculus tools give a final answer with little or no explanation, or put the steps behind a paywall. {siteConfig.name}{" "}
        does the opposite. It shows which rule produced each line, says plainly when it cannot solve something, and costs
        nothing.
      </p>
      <p>
        It is built for high school, AP and college students, for teachers who want quick, checked examples, and for adults
        returning to math on their own.
      </p>

      <h2>Principles</h2>
      <ul>
        <li>
          <strong>Correct or honest.</strong> Every answer is checked by an independent method before it is shown. If the check
          fails, or a problem is beyond the solver, you get a clear explanation instead of a guess.
        </li>
        <li>
          <strong>Steps that teach.</strong> Each step names the rule it uses, because recognising which rule applies is the
          skill calculus courses assess.
        </li>
        <li>
          <strong>Private by design.</strong> The solver runs entirely in your browser. There are no accounts, no tracking and
          no uploads.
        </li>
        <li>
          <strong>Learning, not shortcuts.</strong> The tool is meant for checking and understanding your work. We ask users to
          follow their school&apos;s rules on calculators.
        </li>
      </ul>

      <h2>How the content is checked</h2>
      <p>
        All formulas and <Link href="/guides">worked examples</Link> on this site are standard results from first-year calculus. Every worked example
        published here is also checked automatically: before each release, an automated test feeds each example to the solver
        and confirms that it reproduces the stated answer. The same test suite checks the solver against a larger set of
        problems with known answers, including derivatives, integrals, limits, Taylor polynomials and critical points.
      </p>
      <p>
        The methods are documented on <Link href="/how-it-works">How the Solver Works</Link>, with references to standard
        textbooks and to the numerical methods used.
      </p>

      <h2>Technology</h2>
      <p>
        The math engine (parser, simplifier, differentiation, integration, limits and series) was written for this site. A
        bundled open-source computer algebra system, Algebrite, serves as a fallback for some harder integrals. Math is
        typeset with KaTeX. Everything is open-source software that runs in the browser, with no paid services or external
        APIs.
      </p>

      <h2>Found a mistake?</h2>
      <p>
        If the solver gives a wrong answer or a confusing step, we want to know. Please <Link href="/contact">get in touch</Link>{" "}
        and include the expression and the options you chose.
      </p>
    </ProsePage>
  );
}
