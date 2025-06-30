'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Plausible, { EventOptions, PlausibleOptions } from 'plausible-tracker'

// Initialize Plausible
const plausible = Plausible({
  domain: 'dankdealsmn.com',
  apiHost: 'https://pl.dankdealsmn.com',
  trackLocalhost: process.env.NODE_ENV === 'development',
})

// Custom events
export const trackEvent = (eventName: string, options?: EventOptions) => {
  plausible.trackEvent(eventName, options)
}

// Predefined events
export const analyticsEvents = {
  // Navigation and engagement
  pageView: (page: string, properties?: Record<string, any>) => trackEvent('page_view', { props: { page, ...properties } }),
  productView: (productId: string, productName: string) => trackEvent('product_view', { props: { product_id: productId, product_name: productName } }),
  categoryView: (category: string) => trackEvent('category_view', { props: { category } }),
  searchPerformed: (query: string, results: number) => trackEvent('search', { props: { query, results: results.toString() } }),

  // Commerce events  
  addToCart: (productId: string, productName: string, price: number, quantity: number) => trackEvent('add_to_cart', { 
    props: {
      product_id: productId, 
      product_name: productName, 
      price: price.toString(), 
      quantity: quantity.toString()
    }
  }),
  removeFromCart: (productId: string) => trackEvent('remove_from_cart', { props: { product_id: productId } }),
  beginCheckout: (cartValue: number, itemCount: number) => trackEvent('begin_checkout', { props: { value: cartValue.toString(), items: itemCount.toString() } }),
  purchase: (orderId: string, revenue: number, items: number) => trackEvent('purchase', { 
    props: {
      transaction_id: orderId, 
      value: revenue.toString(), 
      items: items.toString()
    }
  }),

  // User interactions
  contactClick: (method: string) => trackEvent('contact_click', { props: { method } }),
  socialShare: (platform: string, url: string) => trackEvent('social_share', { props: { platform, url } }),
  newsletterSignup: (source: string) => trackEvent('newsletter_signup', { props: { source } }),
  
  // PWA events
  pwaInstallPromptShown: () => trackEvent('pwa_install_prompt_shown'),
  pwaInstallPromptAccepted: () => trackEvent('pwa_install_prompt_accepted'),
  pwaInstallPromptDismissed: () => trackEvent('pwa_install_prompt_dismissed'),
  pwaInstall: () => trackEvent('pwa_install'),

  // Error tracking
  errorOccurred: (error: string, context?: string) => trackEvent('error', { 
    props: { 
      error, 
      ...(context && { context }) 
    } 
  }),
  
  // Performance tracking
  webVitals: (metric: string, value: number, rating: string) => trackEvent('web_vitals', { props: { metric, value: value.toString(), rating } }),

  // Business metrics
  deliveryAreaView: (area: string) => trackEvent('delivery_area_view', { props: { area } }),
  menuFilterUsed: (filter: string) => trackEvent('menu_filter_used', { props: { filter } }),
  productReviewRead: (productId: string) => trackEvent('product_review_read', { props: { product_id: productId } }),
}

// Analytics Provider Component
export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track pageviews
    plausible.trackPageview()
  }, [pathname, searchParams])

  // Track Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reportWebVitals = async () => {
      if ('web-vitals' in window) return

      const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import('web-vitals')

      onCLS((metric) => {
        trackEvent('web_vitals', {
          props: {
            metric_name: 'CLS',
            value: metric.value.toString(),
            rating: metric.rating,
          },
        })
      })

      onFID((metric) => {
        trackEvent('web_vitals', {
          props: {
            metric_name: 'FID',
            value: metric.value.toString(),
            rating: metric.rating,
          },
        })
      })

      onFCP((metric) => {
        trackEvent('web_vitals', {
          props: {
            metric_name: 'FCP',
            value: metric.value.toString(),
            rating: metric.rating,
          },
        })
      })

      onLCP((metric) => {
        trackEvent('web_vitals', {
          props: {
            metric_name: 'LCP',
            value: metric.value.toString(),
            rating: metric.rating,
          },
        })
      })

      onTTFB((metric) => {
        trackEvent('web_vitals', {
          props: {
            metric_name: 'TTFB',
            value: metric.value.toString(),
            rating: metric.rating,
          },
        })
      })
    }

    reportWebVitals()
  }, [])

  // Track custom 404s
  useEffect(() => {
    if (pathname === '/404') {
      trackEvent('404', {
        props: {
          url: window.location.href,
          referrer: document.referrer,
        },
      })
    }
  }, [pathname])

  return null
}

// Hook for using analytics in components
export function useAnalytics() {
  return {
    track: trackEvent,
    events: analyticsEvents,
  }
} 