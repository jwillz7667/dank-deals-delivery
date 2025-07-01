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

// Server-side rendered LCP content for immediate paint
function CriticalLCPContent() {
  return (
    <>
      {/* Mobile LCP - Server rendered for immediate paint */}
      <div 
        className="lg:hidden max-w-sm mx-auto pb-4 px-4"
        id="lcp-placeholder"
        style={{ 
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="glass-card border-app-green-200 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-app-green-600 to-app-green-700 rounded-xl flex items-center justify-center mr-3">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8V7c0-1.1-.9-2-2-2H2v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5h-3l-1-6zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-app-green-800">Fast Delivery Available!</h3>
            </div>
            <p className="text-sm text-app-green-700 mb-4">
              Weed delivery anywhere in the Twin Cities & suburbs in 1 hour or less!
            </p>
            <div className="w-full h-10 bg-app-green-600 rounded-md flex items-center justify-center text-white font-medium">
              View All Delivery Areas
            </div>
          </div>
        </div>
      </div>

      {/* Desktop LCP - Server rendered for immediate paint */}
      <div 
        className="hidden lg:block max-w-7xl mx-auto pb-4 px-4"
        id="lcp-placeholder-desktop"
        style={{ 
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-4">
                  Premium Cannabis
                  <br />
                  <span className="text-app-green-600">Delivered Fresh</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Minneapolis & St. Paul's most trusted cannabis delivery service
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-5">
            <div className="glass-card border-app-green-200 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="p-4 text-center">
                <h3 className="font-semibold text-app-green-800 mb-2">Ready to Order?</h3>
                <p className="text-sm text-app-green-700 mb-4">
                  Text or call us to complete your order
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-app-green-600 rounded-md flex items-center justify-center text-white font-medium text-sm">
                    Text to Order
                  </div>
                  <div className="flex-1 h-10 border border-app-green-600 text-app-green-600 rounded-md flex items-center justify-center font-medium text-sm">
                    Call Now
                  </div>
                </div>
                <p className="text-xs text-app-green-600 font-medium mt-2">
                  📞 (612) 930-1390
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide placeholders once client component loads */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Hide LCP placeholders once client components are ready
            window.addEventListener('DOMContentLoaded', function() {
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.addedNodes.length > 0) {
                    // Check if client content has loaded
                    const clientContent = document.querySelector('main[class*="pt-20"]');
                    if (clientContent) {
                      const mobilePlaceholder = document.getElementById('lcp-placeholder');
                      const desktopPlaceholder = document.getElementById('lcp-placeholder-desktop');
                      if (mobilePlaceholder) mobilePlaceholder.style.display = 'none';
                      if (desktopPlaceholder) desktopPlaceholder.style.display = 'none';
                      observer.disconnect();
                    }
                  }
                });
              });
              observer.observe(document.body, { childList: true, subtree: true });
            });
          `
        }}
      />
    </>
  )
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
      
      {/* Critical LCP content renders immediately on server */}
      <CriticalLCPContent />
      
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
