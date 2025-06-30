"use client"

import { Suspense, useEffect } from "react"
import { preloadCriticalIcons } from "@/lib/icons"
import dynamic from "next/dynamic"

// Lazy load heavy components to dramatically reduce initial bundle
const HeroSection = dynamic(() => import("@/components/hero-section"), {
  loading: () => null, // No loading state needed since we have server-rendered LCP
  ssr: true // Enable SSR for faster rendering
})

const CategoriesSection = dynamic(() => import("@/components/categories-section"), {
  loading: () => (
    <div className="animate-pulse space-y-4 max-w-7xl mx-auto px-4">
      <div className="h-8 bg-gray-300 rounded w-48"></div>
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-32 h-32 bg-gray-300 rounded-2xl flex-shrink-0"></div>
        ))}
      </div>
    </div>
  ),
  ssr: false
})

const FeaturedProducts = dynamic(() => import("@/components/featured-products"), {
  loading: () => (
    <div className="animate-pulse space-y-4 max-w-7xl mx-auto px-4">
      <div className="h-8 bg-gray-300 rounded w-48"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-300 rounded-xl"></div>
        ))}
      </div>
    </div>
  ),
  ssr: false
})

const DeliverySection = dynamic(() => import("@/components/delivery-section"), {
  loading: () => (
    <div className="animate-pulse space-y-4 max-w-7xl mx-auto px-4 py-16">
      <div className="h-16 bg-gray-300 rounded"></div>
    </div>
  ),
  ssr: false
})

export default function ClientHomePage() {
  // Preload critical icons on client mount
  useEffect(() => {
    preloadCriticalIcons()
  }, [])

  return (
    <main className="pt-20 pb-24">
      {/* Mobile Layout */}
      <div className="lg:hidden px-4">
        <Suspense fallback={
          <div className="max-w-sm mx-auto space-y-10">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded-xl mb-6"></div>
              <div className="h-24 bg-gray-300 rounded-xl mb-8"></div>
              <div className="flex gap-3 overflow-hidden mb-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-300 rounded-2xl flex-shrink-0"></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-300 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        }>
          <HeroSection isMobile={true} />
        </Suspense>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block px-4">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto animate-pulse space-y-16">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-7 space-y-6">
                <div className="h-16 bg-gray-300 rounded"></div>
                <div className="h-8 bg-gray-300 rounded w-2/3"></div>
                <div className="h-12 bg-gray-300 rounded w-1/2"></div>
                <div className="flex gap-4">
                  <div className="h-12 w-32 bg-gray-300 rounded"></div>
                  <div className="h-12 w-32 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="col-span-5">
                <div className="h-80 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        }>
          <HeroSection isMobile={false} />
        </Suspense>

        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 animate-pulse space-y-6 mt-16">
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        }>
          <DeliverySection />
        </Suspense>

        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-32 h-32 bg-gray-300 rounded-2xl flex-shrink-0"></div>
              ))}
            </div>
          </div>
        }>
          <CategoriesSection isMobile={false} />
        </Suspense>

        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 animate-pulse space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-300 rounded w-48"></div>
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        }>
          <FeaturedProducts limit={6} isMobile={false} />
        </Suspense>
      </div>
    </main>
  )
} 