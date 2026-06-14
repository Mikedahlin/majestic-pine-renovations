import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllServiceSlugs } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about-us",
    "/commercial-contracting-minnesota",
    "/services",
    "/contact",
  ];

  const serviceRoutes = getAllServiceSlugs().map(
    (slug) => `/services/${slug}`,
  );

  return [...staticRoutes, ...serviceRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/services/") ? 0.7 : 0.8,
  }));
}
