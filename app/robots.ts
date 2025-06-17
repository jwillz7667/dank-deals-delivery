import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dankdealsmn.com'
  
  return {
    rules: [
      // General crawling rules for all bots
      {
        userAgent: '*',
        allow: [
          '/',
          '/menu',
          '/menu/',
          '/product/',
          '/delivery/',
          '/delivery/*',
          '/faq',
          '/mission',
          '/accessibility',
          '/privacy-policy',
          '/terms-of-service',
          '/cookie-policy',
          '/delivery-policy',
          '/cannabis-compliance',
          '/return-policy',
          '/return-refund-policy',
          '/_next/static/', // Allow static assets for performance
          '/_next/image', // Allow Next.js image optimization
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/', // Block most Next.js internals
          '/profile/',
          '/profile/*',
          '/order-confirmation/',
          '/order-confirmation/*',
          '/handler/',
          '/handler/*',
          '/cart',
          '/checkout',
          '/_vercel/',
          '/node_modules/',
          '/.git/',
          '/.env*',
          '/sitemap.xml/', // Block the sitemap directory (not the file)
          '/manifest.json',
          '/*?*add-to-cart*', // Block cart action URLs
          '/*?*remove-from-cart*',
          '/*?*quantity*',
          '/*?*payment*',
          '/*?*token*',
          '/*?*session*',
          '/*?*auth*',
        ],
        crawlDelay: 1, // Be respectful to server resources
      },
      
      // Specific rules for Googlebot - more permissive
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/menu',
          '/menu/',
          '/menu?category=*', // Allow category filtering
          '/product/',
          '/product/*',
          '/delivery/',
          '/delivery/*',
          '/faq',
          '/mission',
          '/accessibility',
          '/privacy-policy',
          '/terms-of-service',
          '/cookie-policy',
          '/delivery-policy',
          '/cannabis-compliance',
          '/return-policy',
          '/return-refund-policy',
          '/_next/static/', // Critical for page rendering
          '/_next/image', // Critical for image optimization
        ],
        disallow: [
          '/api/',
          '/profile/',
          '/profile/*',
          '/order-confirmation/',
          '/order-confirmation/*',
          '/admin/',
          '/handler/',
          '/handler/*',
          '/cart',
          '/cart/',
          '/checkout',
          '/checkout/',
          '/_vercel/',
          '/.git/',
          '/node_modules/',
          '/*?*add-to-cart*',
          '/*?*remove-from-cart*',
          '/*?*payment*',
          '/*?*token*',
          '/*?*session*',
          '/*?*auth*',
          '/*?*login*',
          '/*?*signup*',
        ],
        crawlDelay: 0.5, // Faster crawling for Google
      },
      
      // Specific rules for Bingbot
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/menu',
          '/menu/',
          '/menu?category=*',
          '/product/',
          '/product/*',
          '/delivery/',
          '/delivery/*',
          '/faq',
          '/mission',
          '/accessibility',
          '/privacy-policy',
          '/terms-of-service',
          '/cookie-policy',
          '/delivery-policy',
          '/cannabis-compliance',
          '/return-policy',
          '/return-refund-policy',
        ],
        disallow: [
          '/api/',
          '/profile/',
          '/order-confirmation/',
          '/admin/',
          '/handler/',
          '/cart',
          '/checkout',
          '/_next/',
          '/_vercel/',
        ],
        crawlDelay: 1,
      },
      
      // Block malicious bots and scrapers
      {
        userAgent: [
          'CCBot', // Common Crawl
          'ChatGPT-User', // OpenAI
          'GPTBot', // OpenAI
          'CCBot*',
          'ChatGPT*',
          'anthropic-ai', // Anthropic
          'Claude-Web', // Anthropic
        ],
        disallow: '/',
      },
      
      // Block SEO and marketing bots that don't add value
      {
        userAgent: [
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'SemrushBot',
          'SplitSignalBot',
          'BUbiNG',
        ],
        disallow: '/',
        crawlDelay: 86400, // Effectively block with 24-hour delay
      },
    ],
    
    // Sitemap location for search engines
    sitemap: `${baseUrl}/sitemap.xml`,
    
    // Additional directives (commented out as they're not widely supported)
    // Note: These are not standard robots.txt directives but are included for documentation
    // host: baseUrl, // Preferred domain (Google ignores this)
    // crawlDelay: 1, // Global crawl delay (moved to individual rules)
  }
} 