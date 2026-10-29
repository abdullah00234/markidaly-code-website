// Calendly's inline widget (BookGrowthAudit.tsx) opens an iframe and makes
// its own requests to calendly.com; particles.js (WhyMarkidly.tsx) and the
// testimonial avatars (Testimonials.tsx, currently placeholder content) are
// the only other third-party origins this site loads from.
//
// 'unsafe-inline' is required for BOTH script-src and style-src here: Next
// renders required per-request inline <script> tags (the RSC flight-data
// payload that hydration depends on) whose content can't be pinned to a
// static hash or nonce without moving this route to dynamic rendering (a
// proxy.ts-based nonce setup) — and per the CSP spec, adding a hash/nonce to
// script-src would make browsers *ignore* 'unsafe-inline' entirely for
// everything else, which silently breaks hydration site-wide. This CSP
// still does real work: it allowlists exactly which third-party origins can
// be referenced at all, and blocks everything else (objects, framing, etc).
// React's dev-mode debugging (e.g. reconstructing component stacks across
// the Turbopack/HMR boundary) calls eval(), which production React never
// does — so 'unsafe-eval' is added to script-src only when NODE_ENV isn't
// "production" (true for `next dev`, unset for `next build`/`next start`),
// keeping the deployed CSP exactly as restrictive as before.
const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://assets.calendly.com https://cdn.jsdelivr.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.21st.dev",
  "font-src 'self' data:",
  "connect-src 'self' https://*.calendly.com",
  "frame-src https://calendly.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // This is a single-page marketing site with a small atomic (Tailwind)
    // CSS bundle, so first-visit render speed matters more than the
    // cross-page caching an external stylesheet would otherwise give —
    // inlining removes the render-blocking <link rel="stylesheet"> request.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
