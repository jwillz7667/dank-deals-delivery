import type { MetadataRoute } from "next"
import { cities } from "@/lib/cities"

// Use environment variable for production URL or fallback to default
const URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dankdeals.org"

export default function sitemap(): MetadataRoute.Sitemap {
  // Get the current date for lastModified
  const currentDate = new Date().toISOString()
  
  // Homepage - Highest priority, most frequently updated
  const homepage: MetadataRoute.Sitemap = [{
    url: URL,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 1.0,
  }]

  // Menu page - High priority, frequently updated with new products
  const menuPage: MetadataRoute.Sitemap = [{
    url: `${URL}/menu`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.95,
  }]

  // City delivery pages - Very high priority for local SEO
  // Each city page is crucial for local search rankings
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${URL}/delivery/${city}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }))

  // Static informational pages - Lower priority but still important
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${URL}/mission`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${URL}/faq`,
      lastModified: currentDate,
      changeFrequency: "weekly", // FAQs might be updated more frequently
      priority: 0.8,
    },
  ]

  // Combine all routes in order of priority
  return [
    ...homepage,
    ...menuPage,
    ...cityRoutes,
    ...staticPages,
  ]
}
