import type { MetadataRoute } from "next";

// Single-page marketing site — one entry for the homepage. Add more entries
// here if additional routes are introduced.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.markidly.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
