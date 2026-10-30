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
};

export default nextConfig;
