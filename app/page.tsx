"use client"

import { useState, useRef } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import BentoGridSection from "@/components/bento-grid-section"
import Footer from "@/components/footer"
import AiBudtenderModal from "@/components/modals/ai-budtender-modal"
import ProductDetailModal from "@/components/modals/product-detail-modal"
import type { Product } from "@/lib/products"
import useIntersectionObserver from "@/hooks/use-intersection-observer"
import { useRouter } from "next/navigation"
import JsonLd from "@/components/json-ld"

// It's better to define metadata statically if possible, or use generateMetadata for dynamic cases.
// For this client component page, we'll keep it simple. For full SEO, consider server components for metadata.
// However, the root layout already sets strong defaults.

export default function HomePage() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [initialBudtenderMessage, setInitialBudtenderMessage] = useState<string>("")
  const router = useRouter()

  const bentoGridRef = useRef<HTMLDivElement>(null)
  useIntersectionObserver([bentoGridRef])

  const handleAiBudtenderClick = (initialMessage?: string) => {
    if (initialMessage) {
      setInitialBudtenderMessage(initialMessage)
    }
    setIsAiModalOpen(true)
  }

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "DankDeals.org - Premier Cannabis Gifting in Minneapolis & St. Paul",
    description:
      "Discover DankDeals.org, your top choice for cannabis gifting in the Twin Cities. Explore our premium menu and try our innovative AI Budtender for personalized recommendations.",
    url: "https://dankdeals.org/",
    isPartOf: {
      "@type": "WebSite",
      url: "https://dankdeals.org/",
      name: "DankDeals.org",
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <JsonLd data={homePageSchema} />
      <Header />
      <main>
        <HeroSection onCtaClick={() => router.push("/menu")} />
        <div ref={bentoGridRef} className="fade-in-section">
          <BentoGridSection onAiBudtenderClick={handleAiBudtenderClick} onProductClick={setSelectedProduct} />
        </div>
      </main>
      <Footer />
      <AiBudtenderModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false)
          setInitialBudtenderMessage("")
        }}
        onProductSelect={setSelectedProduct}
        initialMessage={initialBudtenderMessage}
      />
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
