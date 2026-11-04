import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { CookieConsent } from "@/components/cookies/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollableRegions } from "@/components/layout/ScrollableRegions";
import { siteConfig } from "@/lib/site-config";
import { themeInitScript } from "@/lib/theme";

// Self-hosted by next/font at build time: no requests to Google from visitors' browsers.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
  verification: { google: "_YeJOIbO149EP72dVMRjJqHVexGU12OUg0LegLX8Gz0" },
};

export const viewport: Viewport = {
  themeColor: [
    // Matches the navy header in both themes.
    { media: "(prefers-color-scheme: light)", color: "#10143b" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e2a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script sets data-theme before React hydrates.
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
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
          <ScrollableRegions />
        </CookieConsent>
      </body>
    </html>
  );
}
