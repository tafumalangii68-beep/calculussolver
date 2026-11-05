import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/** Shows the owner's email as a mailto link, or an honest notice if none is configured yet. */
export function ContactEmail({ fallback }: { fallback?: string }) {
  if (!siteConfig.contactEmail) {
    return fallback ? <span>{fallback}</span> : <span>the contact details published on our <Link href="/contact">Contact page</Link></span>;
  }
  return <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>;
}
