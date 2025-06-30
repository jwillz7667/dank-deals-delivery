import type React from "react"
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import JsonLd from "@/components/json-ld"
import { siteConfig } from "@/config/site"
import BottomNavigation from "@/components/bottom-navigation"
import { products } from "@/lib/products"
import { CartProvider } from "@/hooks/use-cart"
import { AgeVerificationProvider } from "@/hooks/use-age-verification"
import AgeVerificationWrapper from "@/components/age-verification-wrapper"
import { Suspense } from "react"
import { createProductSlug } from "@/lib/utils"
import PWAInstallPrompt from '@/components/pwa-install-prompt'
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import AnalyticsLoader from "@/components/analytics-loader"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | DankDealsMN`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "DankDealsMN", url: siteConfig.url }],
  creator: "DankDealsMN",
  publisher: "DankDealsMN",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: { default: siteConfig.name, template: `%s | DankDealsMN` },
    description: siteConfig.description,
    siteName: "DankDealsMN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DankDealsMN - Premium Cannabis Delivery in Minneapolis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: { default: siteConfig.name, template: `%s | DankDealsMN` },
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
    creator: "@dankdealsmn",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#2B5D3F"
      }
    ]
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  generator: 'Next.js',
  other: {
    'theme-color': '#2B5D3F',
    'color-scheme': 'light',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-green-600"></div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DankDealsMN",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-612-930-1390",
      contactType: "Customer Service",
      areaServed: "US",
      availableLanguage: "en",
    },
    sameAs: [
      // Add social media links if available
    ],
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DankDealsMN",
    url: siteConfig.url,
    image: `${siteConfig.url}/og-image.png`,
    telephone: "+16129301390",
    description: "Premium cannabis products available for delivery in the Twin Cities. Text to order at (612) 930-1390.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Minneapolis",
      addressRegion: "MN",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "44.9778",
      longitude: "-93.2650",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Minneapolis",
      },
      {
        "@type": "City",
        name: "St. Paul",
      },
      {
        "@type": "AdministrativeArea",
        name: "Twin Cities Metropolitan Area",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cannabis Product Menu",
      itemListElement: products.slice(0, 5).map((product) => ({
        "@type": "Offer",
        // FIXED: Ensure pricing data is always available for Google structured data requirements
        price: product.pricing && product.pricing[0] ? product.pricing[0].price.toString() : "0",
        priceCurrency: "USD",
        availability: product.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        url: `${siteConfig.url}/product/${createProductSlug(product.name)}`,
        itemCondition: `https://schema.org/${product.condition || 'New'}Condition`,
        priceValidUntil: "2025-12-31",
        itemOffered: {
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: `${siteConfig.url}${product.imageUrl.startsWith("/") ? product.imageUrl : "/" + product.imageUrl}`,
          category: {
            "@type": "ProductCategory",
            name: product.category,
            url: `${siteConfig.url}/menu?category=${product.category.toLowerCase()}`
          },
          brand: {
            "@type": "Brand",
            name: product.brand || "DankDeals"
          },
          ...(product.sku && { sku: product.sku }),
          additionalProperty: [
            ...(product.thcContent ? [{
              "@type": "PropertyValue",
              name: "THC Content",
              value: product.thcContent
            }] : []),
            ...(product.strainType ? [{
              "@type": "PropertyValue",
              name: "Strain Type",
              value: product.strainType
            }] : [])
          ]
        },
        seller: {
          "@type": "Organization",
          name: "DankDealsMN.com",
          url: siteConfig.url
        }
      })).filter(offer => offer.itemOffered), // Filter out any undefined offers
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Critical CSS for LCP optimization */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical LCP styles - inline for immediate paint */
              .glass-card {
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(12px);
                border-radius: 0.75rem;
                border: 1px solid rgba(34, 197, 94, 0.2);
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              }
              
              #lcp-placeholder, #lcp-placeholder-desktop {
                opacity: 1;
                transition: opacity 0.3s ease-out;
              }
              
              #lcp-placeholder.hide, #lcp-placeholder-desktop.hide {
                opacity: 0;
                pointer-events: none;
              }
              
              /* Prevent CLS during component swap */
              [id^="lcp-placeholder"] {
                will-change: opacity;
                transform: translateZ(0);
              }
              
              /* App green color variables for immediate use */
              :root {
                --app-green-600: #059669;
                --app-green-700: #047857;
                --app-green-800: #065f46;
              }
            `
          }}
        />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/inter-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/inter-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://stackframe.cloud" />
        
        {/* Only preload critical resources that are actually used */}
        <link rel="prefetch" href="/DANKDEALSMN.COM-LOGO.png" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
        <link rel="dns-prefetch" href="//dankdealsmn.com" />
        
        <JsonLd data={organizationSchema} />
        <JsonLd data={localBusinessSchema} />
      </head>
      <body className={cn("min-h-screen bg-app-bg font-sans antialiased", "pb-20 md:pb-0", inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              <Suspense fallback={<LoadingFallback />}>
                <AgeVerificationProvider>
                  <CartProvider>
                    <AgeVerificationWrapper>
                      <div className="min-h-screen bg-app-bg">
                        <Suspense fallback={<LoadingFallback />}>
                          {children}
                        </Suspense>
                      </div>
                      <Toaster />
                    </AgeVerificationWrapper>
                    <BottomNavigation />
                    <AnalyticsLoader />
                    <PWAInstallPrompt />
                  </CartProvider>
                </AgeVerificationProvider>
              </Suspense>
            </StackTheme>
          </StackProvider>
        </ThemeProvider>
        
        {/* Analytics scripts - load async to not block LCP */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID'}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID'}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
      </body>
    </html>
  )
}
