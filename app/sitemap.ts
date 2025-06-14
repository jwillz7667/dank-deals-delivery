import type { MetadataRoute } from "next"
import { cities } from "@/lib/cities"
import { products } from "@/lib/products"
import { createProductSlug } from "@/lib/utils"

// Use environment variable for production URL or fallback to default
const URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dankdealsmn.com"

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

  // Main navigation pages - High priority
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: `${URL}/menu`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${URL}/faq`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${URL}/mission`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Product pages - Very high priority for SEO and revenue
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${URL}/product/${createProductSlug(product.name)}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: product.soldOut ? 0.6 : 0.9, // Higher priority for available products
  }))

  // Category filter pages - Important for SEO
  const categoryRoutes: MetadataRoute.Sitemap = [
    {
      url: `${URL}/menu?category=flower`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${URL}/menu?category=edibles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${URL}/menu?category=vapes`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${URL}/menu?category=prerolls`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${URL}/menu?category=wellness`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ]

  // City delivery pages - Critical for local SEO
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${URL}/delivery/${city}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9, // High priority for local search rankings
  }))

  // User account and interaction pages
  const userPages: MetadataRoute.Sitemap = [
    {
      url: `${URL}/cart`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.6, // Lower priority as it's user-specific
    },
    {
      url: `${URL}/checkout`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5, // Process page, not for discovery
    },
    {
      url: `${URL}/profile`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4, // Private user page
    },
  ]

  // Authentication pages - Lower priority as they're utility pages
  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${URL}/handler/sign-in`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${URL}/handler/sign-up`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  // Legal and policy pages - Include for completeness
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${URL}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]

  // API routes that should be excluded from sitemap
  // These are handled automatically by Next.js and shouldn't be in sitemap

  // Combine all routes in order of priority
  return [
    ...homepage,
    ...mainPages,
    ...productRoutes,
    ...categoryRoutes,
    ...cityRoutes,
    ...userPages,
    ...authPages,
    ...legalPages,
  ].sort((a, b) => (b.priority || 0) - (a.priority || 0)) // Sort by priority descending
}
