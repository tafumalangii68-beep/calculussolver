import { MailtoForm } from "@/components/content/MailtoForm";
import { ProsePage } from "@/components/content/ProsePage";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description = "Contact Calculus Solver to report a wrong answer, suggest a feature, or ask a question about the site.";

export const metadata = buildMetadata({ title: "Contact Us", description, path: "/contact" });

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  return (
    <ProsePage
      title="Contact Us"
      path="/contact"
      description={description}
      lead={<p>Report an incorrect result, suggest an improvement, or ask about the site.</p>}
    >
      <h2>Email</h2>
      {email ? (
        <>
          <p>
            Write to us at <a href={`mailto:${email}`}>{email}</a>. We read every message, though we cannot promise to reply to
            each one or to help with individual homework problems.
          </p>
          <MailtoForm email={email} />
        </>
      ) : (
        <p className="rounded-lg border border-warn/30 bg-warn-soft px-4 py-3 text-warn">
          A contact email address has not been published yet. Please check back soon.
        </p>
      )}

      <h2>Reporting a wrong answer</h2>
      <p>To help us reproduce the problem, please include:</p>
      <ul>
        <li>the exact expression you typed;</li>
        <li>the operation and options (derivative order, bounds, limit point and direction, and so on);</li>
        <li>the answer you expected, and why, if you know.</li>
      </ul>
      <p>
        The solver runs in your browser and never sends us your problems, so we only see what you include in your message.
      </p>
    </ProsePage>
  );
}
