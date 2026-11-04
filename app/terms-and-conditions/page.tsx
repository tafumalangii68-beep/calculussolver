import Link from "next/link";
import { ContactEmail } from "@/components/content/ContactEmail";
import { ProsePage } from "@/components/content/ProsePage";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description = "The terms for using Calculus Solver: acceptable use, academic integrity, accuracy limitations, intellectual property and liability.";

export const metadata = buildMetadata({ title: "Terms and Conditions", description, path: "/terms-and-conditions" });

export default function TermsPage() {
  return (
    <ProsePage title="Terms and Conditions" path="/terms-and-conditions" description={description} updated={siteConfig.legalUpdated}>
      <h2>1. Agreement</h2>
      <p>
        By using {siteConfig.name} (the &ldquo;website&rdquo;), you agree to these terms. If you do not agree, please do not use
        the website.
      </p>

      <h2>2. The service</h2>
      <p>
        The website provides free, browser-based calculus tools and educational content. It requires no account and no
        payment. Calculations run on your own device; see the <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the website in a way that breaks any law or the rules of your school or institution;</li>
        <li>attempt to disrupt, overload or gain unauthorised access to the website or its hosting;</li>
        <li>scrape or copy substantial parts of the website&apos;s content for republication without permission;</li>
        <li>misrepresent the website&apos;s output as an endorsement by the website or its owner.</li>
      </ul>

      <h2>4. Academic integrity</h2>
      <p>
        The calculators are meant to help you learn and check your own work. You are responsible for following the rules set
        by your teachers, schools and exam boards. Many of them prohibit calculators like this one on graded assignments,
        quizzes or exams. Submitting solver output as your own work where that is not allowed is your responsibility, not the
        website&apos;s.
      </p>

      <h2>5. Accuracy</h2>
      <p>
        The solver uses deterministic, documented methods and checks its answers, but no software is free of errors. Results
        and steps may be wrong, incomplete, or presented in an equivalent form that differs from your textbook&apos;s.
        Numerical results are approximations. Verify important results independently. The website must not be relied on for
        engineering, financial, medical, safety-critical or other high-stakes decisions. See the{" "}
        <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The website&apos;s text, worked examples, design and original code belong to the website owner. You may use the
        calculators&apos; output freely for your own study, and you may quote short excerpts of the content with a link back.
        The website includes open-source software under its own licences, including Next.js and React (MIT), KaTeX (MIT),
        Algebrite (MIT) and Lucide icons (ISC). Those licences, not these terms, govern that software.
      </p>

      <h2>7. Reviews you submit</h2>
      <p>
        If you submit a review, it must reflect your own genuine experience. Do not include other people&apos;s personal
        information, links, advertising or abusive content, and do not post reviews on someone else&apos;s behalf or in return
        for payment. By submitting a review, you allow us to publish it on the website with the name you gave. We may decline
        to publish, or later remove, any review, and you can ask us to remove yours at any time.
      </p>

      <h2>8. Availability</h2>
      <p>
        The website is provided free of charge and may change, be unavailable, or be discontinued at any time without notice.
        Features may be added or removed.
      </p>

      <h2>9. Links to other websites</h2>
      <p>The website may link to external resources. We are not responsible for their content or privacy practices.</p>

      <h2>10. Disclaimer of warranties</h2>
      <p>
        To the extent permitted by law, the website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
        warranties of any kind, express or implied, including warranties of accuracy, fitness for a particular purpose and
        non-infringement.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the extent permitted by law, the website owner is not liable for any indirect, incidental or consequential loss,
        or for any loss arising from reliance on results produced by the website, including lost marks, grades or data. Some
        jurisdictions do not allow certain limitations, so parts of this section may not apply to you.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update these terms. The date at the top shows when they last changed. Continuing to use the website after a
        change means you accept the updated terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these terms can be sent to <ContactEmail />.
      </p>
    </ProsePage>
  );
}
