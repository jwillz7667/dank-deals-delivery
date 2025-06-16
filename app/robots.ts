import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dankdealsmn.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/profile/',
          '/order-confirmation/',
          '/handler/api/',
          '/_vercel/',
          '/node_modules/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/menu',
          '/menu/',
          '/product/',
          '/delivery/',
          '/faq',
          '/mission',
        ],
        disallow: [
          '/api/',
          '/profile/',
          '/order-confirmation/',
          '/admin/',
          '/handler/',
          '/cart',
          '/checkout',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 