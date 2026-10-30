import { siteConfig } from "@/lib/site-config";

/** Shows the owner's email as a mailto link, or an honest notice if none is configured yet. */
export function ContactEmail({ fallback = "the contact details published on our Contact page" }: { fallback?: string }) {
  if (!siteConfig.contactEmail) {
    return <span>{fallback}</span>;
  }
  return <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>;
}
