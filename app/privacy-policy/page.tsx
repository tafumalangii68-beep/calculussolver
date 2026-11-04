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
      lead={<p>The short version: your math stays on your device, we use no tracking, and the only personal information we receive is what you choose to put in a review.</p>}
    >
      <h2>Who this policy covers</h2>
      <p>
        This policy explains how {siteConfig.name} ({siteConfig.url}) handles information when you visit the website and use
        its calculators. It describes the website as it is actually built. If we add a feature that changes any of this, we
        will update this page first.
      </p>

      <h2>Information we collect</h2>
      <p>
        There are no accounts, no sign-up or login, no analytics and no advertising. The website receives information in only
        two situations, both described below:
      </p>
      <ul>
        <li>when you choose to submit a review; and</li>
        <li>an anonymous count each time a problem is solved, which contains no personal information and nothing you typed.</li>
      </ul>

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

      <h2>Reviews</h2>
      <p>If you submit a review on the <Link href="/reviews">Reviews</Link> page, we store:</p>
      <ul>
        <li>the name you enter, your star rating and your review text, which are shown publicly once the review is approved;</li>
        <li>your email address, if you choose to give one. It is <strong>never shown publicly</strong> and is used only to contact you about your review;</li>
        <li>the date and time of submission;</li>
        <li>
          a one-way, daily-changing hash of your IP address, used only to limit repeated submissions and spam. Your actual IP
          address is not stored, and the hash cannot be turned back into it.
        </li>
      </ul>
      <p>
        Every review is checked by a person before it is published. We may decline to publish a review, for example if it is
        spam, abusive or contains personal information about someone else. Reviews are stored in a database hosted by Neon
        (neon.tech), our database provider, which processes the data on our behalf.
      </p>

      <h2>Count of problems solved</h2>
      <p>
        When the solver returns an answer, your browser sends an empty request to this website that adds 1 to a public
        &ldquo;problems solved&rdquo; total. The request contains no expression, answer, cookie or identifier. To stop one
        visitor from inflating the total, a daily-changing hash of the IP address (as above) is kept for up to two days and
        then deleted.
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
        Solver input is not retained at all. Reviews are kept while they are published or awaiting a decision; you can ask
        for your review to be deleted at any time. The hashes used to limit solve counting are deleted after about two days.
        The consent record stays in your browser until you withdraw consent (footer: &ldquo;Cookie Settings&rdquo;) or clear
        your browser&apos;s site data. Emails are kept only as long as needed to handle your message.
      </p>

      <h2>Your rights and choices</h2>
      <ul>
        <li>You can change or withdraw your cookie choice at any time using &ldquo;Cookie Settings&rdquo; in the footer.</li>
        <li>You can delete the stored preference by clearing site data in your browser settings.</li>
        <li>
          Depending on where you live (for example under the GDPR or US state privacy laws), you may have rights to access,
          correct or delete personal information about you. If you submitted a review or emailed us, you can ask us to show,
          correct or delete that information by contacting us.
        </li>
        <li>We do not sell or share personal information, and we do not use it for targeted advertising.</li>
      </ul>

      <h2>Children</h2>
      <p>
        The website is designed for students, including high school students. Every calculator can be used without providing
        any information. Reviews are intended for users aged 13 and over; if you are under 13, please do not submit a review.
        If we learn that a review came from a child under 13, we will delete it.
      </p>

      <h2>Security</h2>
      <p>
        Your problems never leave your device, so there is no stored collection of them to protect or leak. Reviews are sent
        over HTTPS and stored with our database provider, with access limited to the site owner.
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
