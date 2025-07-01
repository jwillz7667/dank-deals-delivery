'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Plausible, { EventOptions, PlausibleOptions } from 'plausible-tracker'
import Script from 'next/script'
import dynamic from 'next/dynamic'

// Initialize Plausible
const plausible = Plausible({
  domain: 'dankdealsmn.com',
  apiHost: 'https://pl.dankdealsmn.com',
  trackLocalhost: process.env.NODE_ENV === 'development',
})

// Dynamically import Web Vitals tracker to avoid blocking
const WebVitalsTracker = dynamic(() => import('./web-vitals-tracker'), {
  ssr: false,
  loading: () => null
})

// Plausible Analytics Configuration
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL?.replace(/https?:\/\//, '') || 'dankdealsmn.com'
const PLAUSIBLE_API_HOST = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io'

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

// Custom events tracking for cannabis delivery business
const trackCustomEvent = (eventName: string, props?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Track with Plausible
    if ((window as any).plausible) {
      (window as any).plausible(eventName, { props })
    }
    
    // Track with Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...props,
        event_category: 'Cannabis Delivery',
        non_interaction: false,
      })
    }
  }
}

// Business-specific event tracking
export const trackBusinessEvents = {
  // Age verification events
  ageVerificationStarted: () => trackCustomEvent('age_verification_started'),
  ageVerificationCompleted: (verified: boolean) => 
    trackCustomEvent('age_verification_completed', { verified }),
  
  // Product interaction events
  productViewed: (productId: string, category: string, price: number) =>
    trackCustomEvent('product_viewed', { productId, category, price }),
  
  // Cart events
  addToCart: (productId: string, quantity: number, value: number) =>
    trackCustomEvent('add_to_cart', { productId, quantity, value }),
  removeFromCart: (productId: string) =>
    trackCustomEvent('remove_from_cart', { productId }),
  
  // Checkout events
  checkoutStarted: (value: number) =>
    trackCustomEvent('checkout_started', { value }),
  checkoutCompleted: (orderId: string, value: number, items: number) =>
    trackCustomEvent('checkout_completed', { orderId, value, items }),
  
  // Delivery events
  deliveryAreaChecked: (area: string) =>
    trackCustomEvent('delivery_area_checked', { area }),
  deliveryScheduled: (timeSlot: string) =>
    trackCustomEvent('delivery_scheduled', { timeSlot }),
  orderTracked: (orderId: string) =>
    trackCustomEvent('order_tracked', { orderId }),
  
  // Menu interaction events
  menuViewed: (category?: string) =>
    trackCustomEvent('menu_viewed', { category }),
  menuFiltered: (category: string, filters: Record<string, any>) =>
    trackCustomEvent('menu_filtered', { category, ...filters }),
  
  // Search events
  searchPerformed: (query: string, results: number) =>
    trackCustomEvent('search_performed', { query, results }),
  
  // PWA events
  pwaInstalled: () => trackCustomEvent('pwa_installed'),
  pwaInstallPromptShown: () => trackCustomEvent('pwa_install_prompt_shown'),
  
  // Engagement events
  phoneNumberClicked: () => trackCustomEvent('phone_number_clicked'),
  textOrderStarted: () => trackCustomEvent('text_order_started'),
  socialShareUsed: (platform: string) =>
    trackCustomEvent('social_share_used', { platform }),
  
  // Error tracking
  jsError: (error: string, stack?: string) =>
    trackCustomEvent('js_error', { error, stack }),
  
  // Performance events
  performanceIssue: (metric: string, value: number) =>
    trackCustomEvent('performance_issue', { metric, value }),
}

// Enhanced error tracking
const setupErrorTracking = () => {
  // Global error handler
  window.addEventListener('error', (event) => {
    trackBusinessEvents.jsError(event.error?.message || 'Unknown error', event.error?.stack)
  })

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    trackBusinessEvents.jsError(`Unhandled promise rejection: ${event.reason}`)
  })

  // Resource loading error handler
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      trackCustomEvent('resource_error', {
        resource: (event.target as any)?.src || (event.target as any)?.href,
        type: (event.target as any)?.tagName
      })
    }
  }, true)
}

// Enhanced user engagement tracking
const setupEngagementTracking = () => {
  // Track scroll depth
  let maxScrollDepth = 0
  const trackScrollDepth = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollDepth = Math.round((scrollTop / scrollHeight) * 100)
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth
      
      // Track milestone scroll depths
      if ([25, 50, 75, 90, 100].includes(scrollDepth)) {
        trackCustomEvent('scroll_depth', { depth: scrollDepth })
      }
    }
  }

  // Track time on page
  const startTime = Date.now()
  const trackTimeOnPage = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    trackCustomEvent('time_on_page', { seconds: timeSpent })
  }

  // Track click events on important elements
  const trackClicks = (event: Event) => {
    const target = event.target as HTMLElement
    
    // Track CTA clicks
    if (target.closest('[data-track="cta"]')) {
      const ctaText = target.textContent?.trim()
      trackCustomEvent('cta_clicked', { text: ctaText })
    }
    
    // Track navigation clicks
    if (target.closest('nav a')) {
      const navText = target.textContent?.trim()
      trackCustomEvent('navigation_clicked', { text: navText })
    }
    
    // Track phone number clicks
    if (target.closest('a[href^="tel:"]')) {
      trackBusinessEvents.phoneNumberClicked()
    }
  }

  // Add event listeners
  window.addEventListener('scroll', trackScrollDepth, { passive: true })
  window.addEventListener('beforeunload', trackTimeOnPage)
  document.addEventListener('click', trackClicks)
  
  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackTimeOnPage()
    }
  })
}

// Analytics Provider Component
export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Setup error and engagement tracking
    setupErrorTracking()
    setupEngagementTracking()
  }, [])

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined') {
      // Plausible page view
      if ((window as any).plausible) {
        (window as any).plausible('pageview', {
          props: {
            path: pathname,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
          }
        })
      }
      
      // Google Analytics page view
      if ((window as any).gtag) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: pathname,
          page_title: document.title,
          send_page_view: true,
        })
      }
    }
  }, [pathname])

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

  return (
    <>
      {/* Plausible Analytics */}
      <Script
        src={`${PLAUSIBLE_API_HOST}/js/script.js`}
        data-domain={PLAUSIBLE_DOMAIN}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Plausible Analytics loaded')
        }}
      />

      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
              'custom_parameter_1': 'cannabis_delivery',
              'custom_parameter_2': 'twin_cities'
            },
            // Enhanced ecommerce tracking
            send_page_view: false // We'll send manually for better control
          });
          
          // Track enhanced ecommerce events
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            custom_map: {'custom_parameter_cannabis_category': 'cannabis_product_category'}
          });
        `}
      </Script>

      {/* Enhanced Web Vitals Tracking */}
      <WebVitalsTracker />

      {/* Hotjar or similar user behavior tracking */}
      {process.env.NEXT_PUBLIC_HOTJAR_ID && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}
    </>
  )
}

// Hook for using analytics in components
export function useAnalytics() {
  return {
    track: trackEvent,
    events: analyticsEvents,
  }
} 