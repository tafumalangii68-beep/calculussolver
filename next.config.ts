import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is static content; no request-time data or caching APIs are used.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  // Baseline security headers for every route. HTTPS (HSTS) is already enforced by the host.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Browsers must not guess content types (stops files being run as scripts).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // The site may not be framed by other sites (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Other sites see only the origin, never the full page URL.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site uses none of these device features.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
