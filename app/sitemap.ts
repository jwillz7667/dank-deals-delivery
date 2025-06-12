import type { MetadataRoute } from "next"
import { cities } from "@/lib/cities"

const URL = "https://dankdeals.org"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/menu", "/faq", "/mission"].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  const cityRoutes = cities.map((city) => ({
    url: `${URL}/delivery/${city}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.9, // High priority for local SEO pages
  }))

  return [...staticRoutes, ...cityRoutes]
}
