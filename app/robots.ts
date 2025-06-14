import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dankdealsmn.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/menu',
          '/menu?category=*',
          '/product/*',
          '/delivery/*',
          '/faq',
          '/mission',
          '/cart',
          '/checkout',
          '/handler/sign-in',
          '/handler/sign-up',
        ],
        disallow: [
          '/api/*',           // Private API routes
          '/admin/*',         // Admin routes if any
          '/_next/*',         // Next.js internal files
          '/profile/*',       // Private user profiles
          '/order-confirmation/*', // Private order confirmations
          '/handler/api/*',   // Stack auth internal routes
          '*.json',           // JSON files
          '/temp/*',          // Temporary files
          '/private/*',       // Any private routes
        ],
      },
      // Special rules for well-behaved search engines
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: [
          '/',
          '/menu*',
          '/product/*',
          '/delivery/*',
          '/faq',
          '/mission',
        ],
        disallow: [
          '/api/*',
          '/profile/*',
          '/order-confirmation/*',
          '/admin/*',
          '/handler/api/*',
        ],
        crawlDelay: 1, // 1 second delay between requests
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 