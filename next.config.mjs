/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // This is a single-page marketing site with a small atomic (Tailwind)
    // CSS bundle, so first-visit render speed matters more than the
    // cross-page caching an external stylesheet would otherwise give —
    // inlining removes the render-blocking <link rel="stylesheet"> request.
    inlineCss: true,
  },
};

export default nextConfig;
