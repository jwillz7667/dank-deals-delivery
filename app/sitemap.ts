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
      url: `${URL}/delivery`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.92, // High priority - hub page for all delivery areas
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

  // Category filter pages - Updated to match actual navigation categories
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
    {
      url: `${URL}/menu?category=concentrates`,
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
      changeFrequency: "never", // Dynamic content, not for indexing
      priority: 0.1, // Very low priority as it's user-specific
    },
    {
      url: `${URL}/checkout`,
      lastModified: currentDate,
      changeFrequency: "never", // Process page, not for discovery
      priority: 0.1, // Very low priority
    },
    {
      url: `${URL}/profile`,
      lastModified: currentDate,
      changeFrequency: "never", // Private user page
      priority: 0.1, // Very low priority
    },
  ]

  // Legal and policy pages - Include for completeness and compliance
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${URL}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${URL}/accessibility`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.25,
    },
    {
      url: `${URL}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.25,
    },
    {
      url: `${URL}/delivery-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly", // May change more frequently
      priority: 0.4,
    },
    {
      url: `${URL}/cannabis-compliance`,
      lastModified: currentDate,
      changeFrequency: "monthly", // Compliance may update
      priority: 0.35,
    },
    {
      url: `${URL}/return-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${URL}/return-refund-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Exclude authentication pages and API routes from sitemap
  // These should not be indexed:
  // - /handler/* (authentication routes)
  // - /api/* (API endpoints)
  // - /order-confirmation/* (private user pages)
  // - /_next/* (Next.js internal routes)

  // Combine all routes in order of priority for better crawling efficiency
  return [
    ...homepage,
    ...mainPages,
    ...productRoutes,
    ...categoryRoutes,
    ...cityRoutes,
    ...legalPages,
    ...userPages, // Keep user pages last with lowest priority
  ].sort((a, b) => (b.priority || 0) - (a.priority || 0)) // Sort by priority descending
}
