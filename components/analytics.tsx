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
  plausible(eventName, options)
}

// Predefined events
export const analyticsEvents = {
  // Age verification
  ageVerified: () => trackEvent('age_verified'),
  ageVerificationFailed: () => trackEvent('age_verification_failed'),
  
  // Product interactions
  viewProduct: (productId: string, category: string) => 
    trackEvent('view_product', { props: { product_id: productId, category } }),
  addToCart: (productId: string, quantity: number, value: number) => 
    trackEvent('add_to_cart', { props: { product_id: productId, quantity: quantity.toString(), value: value.toString() } }),
  removeFromCart: (productId: string) => 
    trackEvent('remove_from_cart', { props: { product_id: productId } }),
  
  // Checkout flow
  beginCheckout: (value: number) => 
    trackEvent('begin_checkout', { props: { value: value.toString() } }),
  checkoutStep: (step: string, value: number) => 
    trackEvent('checkout_step', { props: { step, value: value.toString() } }),
  checkoutCompleted: (orderId: string, value: number, paymentMethod: string) => 
    trackEvent('checkout_completed', { 
      props: { 
        order_id: orderId, 
        value: value.toString(), 
        payment_method: paymentMethod 
      } 
    }),
  checkoutAbandoned: (step: string, value: number) => 
    trackEvent('checkout_abandoned', { props: { step, value: value.toString() } }),
  
  // Search
  search: (query: string, resultsCount: number) => 
    trackEvent('search', { props: { query, results_count: resultsCount.toString() } }),
  
  // User actions
  login: (method: string) => trackEvent('login', { props: { method } }),
  signup: (method: string) => trackEvent('signup', { props: { method } }),
  logout: () => trackEvent('logout'),
  
  // PWA events
  pwaInstallPromptShown: () => trackEvent('pwa_install_prompt_shown'),
  pwaInstallAccepted: () => trackEvent('pwa_install_accepted'),
  pwaInstallDismissed: () => trackEvent('pwa_install_dismissed'),
  
  // Delivery tracking
  trackingStarted: (orderId: string) => 
    trackEvent('tracking_started', { props: { order_id: orderId } }),
  driverCalled: (orderId: string) => 
    trackEvent('driver_called', { props: { order_id: orderId } }),
  
  // Blog engagement
  blogPostViewed: (slug: string, category: string) => 
    trackEvent('blog_post_viewed', { props: { slug, category } }),
  blogCategoryViewed: (category: string) => 
    trackEvent('blog_category_viewed', { props: { category } }),
}

// Analytics Provider Component
export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track pageviews
    plausible('pageview')
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