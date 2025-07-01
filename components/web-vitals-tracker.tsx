"use client"

import { useEffect, useRef } from 'react'
import { onCLS, onFCP, onLCP, onTTFB, onINP, onFID } from 'web-vitals'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
  url: string
  timestamp: string
  userAgent: string
  effectiveType?: string
  sessionId: string
}

// Generate session ID for grouping metrics
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const sessionId = typeof window !== 'undefined' ? generateSessionId() : ''

// Batch metrics for efficient reporting
class MetricsBatcher {
  private metrics: WebVitalMetric[] = []
  private batchSize = 5
  private maxWaitTime = 30000 // 30 seconds
  private timeoutId: NodeJS.Timeout | null = null

  add(metric: WebVitalMetric) {
    this.metrics.push(metric)
    
    if (this.metrics.length >= this.batchSize) {
      this.flush()
    } else if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.maxWaitTime)
    }
  }

  private async flush() {
    if (this.metrics.length === 0) return

    const metricsToSend = [...this.metrics]
    this.metrics = []
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    try {
      // Send to Netlify background function
      await fetch('/.netlify/functions/web-vitals-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metricsToSend),
      })

      // Also send to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        metricsToSend.forEach(metric => {
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.rating,
            value: Math.round(metric.value * 1000), // Convert to integer
            non_interaction: true,
          })
        })
      }

      // Send to Plausible for real-time monitoring
      if (typeof window !== 'undefined' && (window as any).plausible) {
        metricsToSend.forEach(metric => {
          (window as any).plausible('web-vital', {
            props: {
              metric: metric.name,
              value: metric.value,
              rating: metric.rating,
              url: metric.url,
            }
          })
        })
      }
    } catch (error) {
      console.error('Failed to send web vitals:', error)
      
      // Store failed metrics for retry (if browser supports it)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'QUEUE_METRICS',
          metrics: metricsToSend
        })
      }
    }
  }

  // Flush remaining metrics on page unload
  flushOnUnload() {
    if (this.metrics.length > 0) {
      // Use sendBeacon for reliability during page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/.netlify/functions/web-vitals-background',
          JSON.stringify(this.metrics)
        )
      }
    }
  }
}

const metricsBatcher = new MetricsBatcher()

export default function WebVitalsTracker() {
  const reportedMetrics = useRef(new Set<string>())

  useEffect(() => {
    // Get connection info for context
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    const sendMetric = (metric: any) => {
      // Prevent duplicate reporting
      const metricKey = `${metric.name}-${metric.id}`
      if (reportedMetrics.current.has(metricKey)) return
      reportedMetrics.current.add(metricKey)

      const webVitalMetric: WebVitalMetric = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: (performance as any).navigation?.type || 'unknown',
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        effectiveType: connection?.effectiveType || 'unknown',
        sessionId,
      }

      metricsBatcher.add(webVitalMetric)
    }

    // Collect all Web Vitals metrics
    onCLS(sendMetric, { reportAllChanges: false })
    onFID(sendMetric) // Keep for backwards compatibility, but INP is preferred
    onFCP(sendMetric)
    onLCP(sendMetric, { reportAllChanges: false })
    onTTFB(sendMetric)
    
    // INP metric (replacement for FID)
    onINP(sendMetric, { reportAllChanges: false })

    // Custom metrics for cannabis delivery site
    const measureCustomMetrics = () => {
      // Time to Interactive (TTI) approximation
      if (document.readyState === 'complete') {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigationEntry) {
          const tti = navigationEntry.domInteractive - navigationEntry.fetchStart
          sendMetric({
            name: 'TTI',
            value: tti,
            rating: tti < 3800 ? 'good' : tti < 7300 ? 'needs-improvement' : 'poor',
            delta: tti,
            id: 'custom-tti',
          })
        }
      }

      // First Paint (FP)
      const fpEntry = performance.getEntriesByName('first-paint')[0]
      if (fpEntry) {
        sendMetric({
          name: 'FP',
          value: fpEntry.startTime,
          rating: fpEntry.startTime < 1800 ? 'good' : fpEntry.startTime < 3000 ? 'needs-improvement' : 'poor',
          delta: fpEntry.startTime,
          id: 'fp',
        })
      }

      // Resource Load Times for critical assets
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const criticalResources = resourceEntries.filter(entry => 
        entry.name.includes('DANKDEALSMN.COM-LOGO.png') ||
        entry.name.includes('.css') ||
        entry.name.includes('critical')
      )

      criticalResources.forEach(resource => {
        const loadTime = resource.responseEnd - resource.fetchStart
        sendMetric({
          name: 'Resource Load Time',
          value: loadTime,
          rating: loadTime < 1000 ? 'good' : loadTime < 2000 ? 'needs-improvement' : 'poor',
          delta: loadTime,
          id: `resource-${resource.name.split('/').pop()}`,
        })
      })
    }

    // Measure custom metrics when page is fully loaded
    if (document.readyState === 'complete') {
      measureCustomMetrics()
    } else {
      window.addEventListener('load', measureCustomMetrics)
    }

    // Flush metrics on page unload
    const handleUnload = () => {
      metricsBatcher.flushOnUnload()
    }

    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)

    // Performance observer for runtime metrics
    if ('PerformanceObserver' in window) {
      // Long Tasks Observer
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              sendMetric({
                name: 'Long Task',
                value: entry.duration,
                rating: entry.duration < 50 ? 'good' : entry.duration < 100 ? 'needs-improvement' : 'poor',
                delta: entry.duration,
                id: `long-task-${Date.now()}`,
              })
            }
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Long task API not supported
      }

      // Layout Shift Observer (additional to CLS)
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          let totalShift = 0
          let shiftCount = 0
          
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              totalShift += entry.value
              shiftCount++
            }
          })

          if (shiftCount > 0) {
            sendMetric({
              name: 'Layout Shift Count',
              value: shiftCount,
              rating: shiftCount < 5 ? 'good' : shiftCount < 10 ? 'needs-improvement' : 'poor',
              delta: shiftCount,
              id: `layout-shift-count-${Date.now()}`,
            })
          }
        })
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // Layout shift API not supported
      }
    }

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [])

  return null // This component doesn't render anything
} 