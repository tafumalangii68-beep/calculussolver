import Link from "next/link";
import { ContactEmail } from "@/components/content/ContactEmail";
import { ProsePage } from "@/components/content/ProsePage";
import { CONSENT_KEY } from "@/lib/consent";
import { THEME_KEY } from "@/lib/theme";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description = "How Calculus Solver handles your data: math is solved in your browser, nothing you type is uploaded or stored, and no tracking scripts are used.";

export const metadata = buildMetadata({ title: "Privacy Policy", description, path: "/privacy-policy" });

export default function PrivacyPolicyPage() {
  return (
    <ProsePage
      title="Privacy Policy"
      path="/privacy-policy"
      description={description}
      updated={siteConfig.legalUpdated}
      lead={<p>The short version: your math stays on your device, we use no tracking, and there is nothing to sign up for.</p>}
    >
      <h2>Who this policy covers</h2>
      <p>
        This policy explains how {siteConfig.name} ({siteConfig.url}) handles information when you visit the website and use
        its calculators. It describes the website as it is actually built. If we add a feature that changes any of this, we
        will update this page first.
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>We do not collect personal information through the website.</strong> There are no accounts, no sign-up or
        login, no contact forms that submit to our servers, no analytics, and no advertising.
      </p>

      <h2>Expressions you enter in the solver</h2>
      <p>
        Every calculation runs in your own browser, using JavaScript downloaded with the page. When you press Solve, your
        expression is passed to a background process (a Web Worker) on your device and the result is displayed on your device.
        Your expressions, answers and settings are:
      </p>
      <ul>
        <li>not sent to our servers or to any third party;</li>
        <li>not saved in cookies, local storage or any other browser storage;</li>
        <li>not logged or retained after you leave or reload the page.</li>
      </ul>
      <p>
        The solver&apos;s code is downloaded from this website when a calculator page loads. After that, solving works even if
        you disconnect from the internet, which shows that it does not depend on a remote service.
      </p>

      <h2>Browser storage and cookies</h2>
      <p>
        The website does not set any cookies. It stores at most two items in your browser&apos;s local storage:
      </p>
      <ul>
        <li>
          <code>{CONSENT_KEY}</code> records your cookie-banner choice (whether optional categories are allowed) and the date
          you made it, so the banner does not reappear on every page.
        </li>
        <li>
          <code>{THEME_KEY}</code> records whether you chose light or dark mode. It is only saved if you use the theme button;
          otherwise the site follows your device&apos;s setting and stores nothing.
        </li>
      </ul>
      <p>
        Neither item contains an identifier, and neither is ever sent to us. See the <Link href="/cookie-policy">Cookie Policy</Link>{" "}
        for details.
      </p>

      <h2>Cookie consent and optional services</h2>
      <p>
        The cookie banner offers optional &ldquo;analytics&rdquo; and &ldquo;marketing&rdquo; categories so that your
        preference can be respected if such services are ever added. At present <strong>no analytics or marketing scripts
        are installed</strong>, so nothing is loaded whatever you choose. If that changes, this policy will name the service,
        and nothing will run until you consent.
      </p>

      <h2>Third-party services</h2>
      <p>
        Fonts, icons, the math renderer (KaTeX) and the math engines are bundled with the website and served from our own
        domain. Pages do not load scripts, fonts or images from third-party domains.
      </p>
      <p>
        The website is delivered by a hosting provider. Like any web server, the host may automatically process technical
        connection data (such as your IP address, browser type, the page requested and the time of the request) in server
        logs, for security and reliability. We do not use these logs to identify or profile visitors.
      </p>

      <h2>If you email us</h2>
      <p>
        If you contact us by email, we receive your email address and whatever you write. We use it only to reply to you, and
        we do not add you to any mailing list. Emails are delivered by your own email provider and ours, under their privacy
        terms.
      </p>

      <h2>Data retention</h2>
      <p>
        Solver input is not retained at all. The consent record stays in your browser until you withdraw consent (footer:
        &ldquo;Cookie Settings&rdquo;) or clear your browser&apos;s site data. Emails are kept only as long as needed to
        handle your message.
      </p>

      <h2>Your rights and choices</h2>
      <ul>
        <li>You can change or withdraw your cookie choice at any time using &ldquo;Cookie Settings&rdquo; in the footer.</li>
        <li>You can delete the stored preference by clearing site data in your browser settings.</li>
        <li>
          Depending on where you live (for example under the GDPR or US state privacy laws), you may have rights to access,
          correct or delete personal information about you. Because the website does not collect personal information, there is
          normally nothing to access. If you have emailed us, you can ask us to delete that correspondence.
        </li>
        <li>We do not sell or share personal information, and we do not use it for targeted advertising.</li>
      </ul>

      <h2>Children</h2>
      <p>
        The website is designed for students, including high school students. It does not knowingly collect personal
        information from anyone, including children under 13. A child can use every calculator without providing any
        information about themselves.
      </p>

      <h2>Security</h2>
      <p>
        Because your problems never leave your device, there is no stored collection of user data to protect or leak. The
        website should be served over HTTPS so that pages cannot be altered in transit.
      </p>

      <h2>Changes to this policy</h2>
      <p>If we change how the website handles information, we will update this page and the date at the top.</p>

      <h2>Contact</h2>
      <p>
        Questions about privacy can be sent to <ContactEmail />.
      </p>
    </ProsePage>
  );
}
