import { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import { cities } from '@/lib/cities'
import { createProductSlug } from '@/lib/utils'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dankdealsmn.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  
  // Static pages with priority and update frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mission`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/delivery-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cannabis-compliance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  // Product pages - high priority for SEO
  const productPages: MetadataRoute.Sitemap = products
    .filter(product => !product.soldOut) // Only include available products
    .map(product => ({
      url: `${baseUrl}/product/${createProductSlug(product.name)}`,
      lastModified: currentDate, // Use current date since updatedAt doesn't exist
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  // City delivery pages for local SEO
  const cityPages: MetadataRoute.Sitemap = cities.map(city => ({
    url: `${baseUrl}/delivery/${city.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Category pages for better navigation
  const categories = [...new Set(products.map(product => product.category))]
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/menu?category=${category.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Blog pages (if they exist)
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    // Individual blog posts would be added here dynamically
    {
      url: `${baseUrl}/blog/best-cannabis-delivery-minneapolis-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/cannabis-laws-minnesota-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/top-cannabis-strains-minneapolis-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Strain type pages for cannabis-specific SEO
  const strainTypes = [...new Set(products.map(product => product.strainType).filter(Boolean))]
  const strainPages: MetadataRoute.Sitemap = strainTypes.map(strainType => ({
    url: `${baseUrl}/strains/${strainType!.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Brand pages for product discovery
  const brands = [...new Set(products.map(product => product.brand).filter(Boolean))]
  const brandPages: MetadataRoute.Sitemap = brands.map(brand => ({
    url: `${baseUrl}/brands/${brand!.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Effect-based pages for cannabis users
  const effects = [
    'relaxing', 'energizing', 'creative', 'sleepy', 'euphoric', 
    'pain-relief', 'anxiety-relief', 'appetite-stimulation'
  ]
  const effectPages: MetadataRoute.Sitemap = effects.map(effect => ({
    url: `${baseUrl}/effects/${effect}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Combine all pages and sort by priority
  return [
    ...staticPages,
    ...productPages,
    ...cityPages,
    ...categoryPages,
    ...blogPages,
    ...strainPages,
    ...brandPages,
    ...effectPages,
  ].sort((a, b) => (b.priority || 0) - (a.priority || 0))
}
