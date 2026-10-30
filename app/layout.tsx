import type { Metadata, Viewport } from "next";
import { Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { CookieConsent } from "@/components/cookies/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/lib/site-config";

// Body text uses the system UI font (no download); only headings use a web font.
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif-display", display: "swap", weight: ["600"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <CookieConsent>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </CookieConsent>
      </body>
    </html>
  );
}
