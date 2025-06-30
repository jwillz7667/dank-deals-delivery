import { Suspense } from "react"
import Header from "@/components/header"
import JsonLd from "@/components/json-ld"
import { preloadCriticalIcons } from "@/lib/icons"
import dynamic from "next/dynamic"

// Client wrapper for dynamic components
const ClientHomePage = dynamic(() => import("@/components/client-home-page"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-green-600"></div>
    </div>
  )
})

// Optimize icon preloading on client side only
if (typeof window !== 'undefined') {
  preloadCriticalIcons()
}

export default function HomePage() {
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "DankDealsMN.com - Premium Cannabis Delivery in Minneapolis & St. Paul",
    description: "Twin Cities' fastest cannabis delivery service. Premium flower, edibles, and vapes delivered in under 30 minutes. Text to order: (612) 930-1390",
    url: "https://dankdealsmn.com/",
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
    isPartOf: {
      "@type": "WebSite",
      url: "https://dankdealsmn.com/",
      name: "DankDealsMN.com",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
      <JsonLd data={homePageSchema} />
      <Header />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-green-600"></div>
        </div>
      }>
        <ClientHomePage />
      </Suspense>
    </div>
  )
}
