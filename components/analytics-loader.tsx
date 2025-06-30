"use client"

import dynamic from 'next/dynamic'

// Dynamic import for analytics - defer until after critical content loads
const Analytics = dynamic(() => import('@/components/analytics'), {
  loading: () => null, // No loading state for analytics
  ssr: false // Analytics is client-side only
})

export default function AnalyticsLoader() {
  return <Analytics />
} 