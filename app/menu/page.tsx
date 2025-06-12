"use client" // Keep client for modal interactions

import { useState } from "react"
import Header from "@/components/header"
import MenuSection from "@/components/menu-section"
import Footer from "@/components/footer"
import ProductDetailModal from "@/components/modals/product-detail-modal"
import type { Product } from "@/lib/products"
import JsonLd from "@/components/json-ld"
// For dynamic metadata in App Router, use generateMetadata if it were a server component
// Since it's client, we'll rely on root layout + specific JSON-LD

export default function MenuPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const menuPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cannabis Menu - DankDeals.org | Twin Cities Gifting",
    description:
      "Explore the full menu of premium cannabis flower, edibles, and vapes available for gifting from DankDeals.org in Minneapolis & St. Paul.",
    url: "https://dankdeals.org/menu",
    mainContentOfPage: {
      "@type": "ItemPage",
      // OfferCatalog is already in root layout, this reinforces the page's purpose
    },
    isPartOf: {
      "@type": "WebSite",
      url: "https://dankdeals.org/",
      name: "DankDeals.org",
    },
  }
  // Static metadata for client components is usually set in layout or via Head component in Pages Router.
  // In App Router, for client pages, dynamic titles are tricky without server involvement.
  // We'll assume the root layout's template handles the base title well.

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <JsonLd data={menuPageSchema} />
      {/* Consider adding a <Head> component or similar if you need to override title/meta from client side,
          though generateMetadata in a parent server component is the App Router way. */}
      <Header />
      <main className="pt-20">
        <MenuSection onProductClick={setSelectedProduct} />
      </main>
      <Footer />
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
