import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

// Lets you open the dev server from a phone on the same Wi-Fi / hotspot
// (http://<this-pc-ip>:3000). Only affects `next dev`.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((a) => a && a.family === "IPv4" && !a.internal)
  .map((a) => a!.address);

// Vercel sets this to the production domain (custom domain once added, else *.vercel.app).
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "";
const hasCustomDomain = productionHost !== "" && !productionHost.endsWith(".vercel.app");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: lanAddresses,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Once a custom domain is the production domain, keep the *.vercel.app copy out
      // of Google so it isn't indexed as a duplicate (canonical links point to the domain).
      ...(hasCustomDomain
        ? [
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: ".*\\.vercel\\.app" }],
              headers: [{ key: "X-Robots-Tag", value: "noindex" }],
            },
          ]
        : []),
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
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
