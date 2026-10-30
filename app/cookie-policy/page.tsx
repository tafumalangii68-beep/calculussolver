import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieConsent";
import { ProsePage } from "@/components/content/ProsePage";
import { CONSENT_KEY } from "@/lib/consent";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description = "Calculus Solver sets no cookies and uses one local storage item to remember your consent choice. See exactly what is stored and how to change it.";

export const metadata = buildMetadata({ title: "Cookie Policy", description, path: "/cookie-policy" });

export default function CookiePolicyPage() {
  return (
    <ProsePage
      title="Cookie Policy"
      path="/cookie-policy"
      description={description}
      updated={siteConfig.legalUpdated}
      lead={<p>This site sets no cookies. It uses a single item of browser storage, and only to remember your choice.</p>}
    >
      <h2>What cookies and browser storage are</h2>
      <p>
        Cookies are small text files that websites can store in your browser and that are sent back to the server with each
        request. Local storage is a similar browser feature, except that the data stays in your browser and is never sent
        automatically. Both can be used for essential features or for tracking, which is why privacy laws regulate them.
      </p>

      <h2>What this website stores</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <caption className="sr-only">Browser storage used by this website</caption>
          <thead>
            <tr className="border-b border-line text-left">
              <th scope="col" className="py-2 pr-4">Name</th>
              <th scope="col" className="py-2 pr-4">Type</th>
              <th scope="col" className="py-2 pr-4">Category</th>
              <th scope="col" className="py-2 pr-4">Purpose</th>
              <th scope="col" className="py-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line align-top">
              <td className="py-2 pr-4"><code>{CONSENT_KEY}</code></td>
              <td className="py-2 pr-4">Local storage</td>
              <td className="py-2 pr-4">Necessary</td>
              <td className="py-2 pr-4">Remembers whether you accepted or rejected optional categories, and when.</td>
              <td className="py-2">Until you withdraw consent or clear site data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        That is the complete list. The calculators do not store your expressions or history, and no cookies are set by this
        website.
      </p>

      <h2>Categories</h2>
      <h3>Necessary storage (always on)</h3>
      <p>
        Needed so the site can respect your preference without asking on every page. It cannot be switched off, because
        without it your choice could not be remembered.
      </p>
      <h3>Analytics (optional, off by default)</h3>
      <p>
        Would allow aggregated statistics about how the site is used. <strong>No analytics service is currently installed.</strong>
      </p>
      <h3>Marketing (optional, off by default)</h3>
      <p>
        Would allow advertising or marketing measurement. <strong>No marketing service is currently installed.</strong>
      </p>
      <p>
        If an optional service is ever added, it will be named here and in the cookie settings, and it will not run until you
        opt in.
      </p>

      <h2>Changing your choice</h2>
      <p>
        You can review, change or withdraw your choice at any time: <CookieSettingsButton className="font-medium text-accent-strong underline underline-offset-2" />.
        Withdrawing consent deletes the stored record, and the banner will ask again. You can also clear this website&apos;s
        data in your browser settings.
      </p>
      <p>
        See the <Link href="/privacy-policy">Privacy Policy</Link> for more about how this website handles information.
      </p>
    </ProsePage>
  );
}
