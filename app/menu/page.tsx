"use client" // Keep client for modal interactions

import { useState, useMemo, useCallback } from "react"
import Header from "@/components/header"
import MenuSection from "@/components/menu-section"
import { type Product } from "@/lib/products"
import JsonLd from "@/components/json-ld"
import dynamic from "next/dynamic"
// For dynamic metadata in App Router, use generateMetadata if it were a server component
// Since it's client, we'll rely on root layout + specific JSON-LD

// Dynamic import for product detail modal - only loads when user clicks on a product
const ProductDetailModal = dynamic(() => import("@/components/modals/product-detail-modal"), {
  loading: () => null, // No loading state for modal overlay
  ssr: false // Modal is client-side only
})

export default function MenuPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  const menuPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cannabis Menu - DankDealsMN",
    description: "Browse our premium selection of cannabis flower, edibles, vapes, and concentrates available for delivery in Minneapolis and St. Paul.",
    url: "https://dankdealsmn.com/menu",
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
    isPartOf: {
      "@type": "WebSite",
      url: "https://dankdealsmn.com/",
      name: "DankDealsMN",
    },
  }
  // Static metadata for client components is usually set in layout or via Head component in Pages Router.
  // In App Router, for client pages, dynamic titles are tricky without server involvement.
  // We'll assume the root layout's template handles the base title well.

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
      <JsonLd data={menuPageSchema} />
      {/* Consider adding a <Head> component or similar if you need to override title/meta from client side,
          though generateMetadata in a parent server component is the App Router way. */}
      <Header />
      <main className="pt-20 pb-24">
        <MenuSection onProductClick={handleProductSelect} />
      </main>
      
      {/* Only render modal when a product is selected - saves ~30KB on initial page load */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
