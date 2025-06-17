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

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
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
      { url: "/my-favicon/favicon.ico" },
      { url: "/my-favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/my-favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" }
    ],
    shortcut: "/my-favicon/favicon.ico",
    apple: "/my-favicon/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/my-favicon/favicon.svg",
        color: "#2B5D3F"
      }
    ]
  },
  manifest: "/my-favicon/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  generator: 'Next.js',
  other: {
    'theme-color': '#2B5D3F',
    'color-scheme': 'light',
  }
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://stackframe.cloud" />
        
        <link rel="preload" href="/hero-fallback.jpg" as="image" type="image/jpeg" />
        <link rel="prefetch" href="/blue-nerds-gelato.jpg" />
        <link rel="prefetch" href="/DANKDEALSMN.COM-LOGO.png" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
        <link rel="dns-prefetch" href="//dankdealsmn.com" />
        
        <JsonLd data={organizationSchema} />
        <JsonLd data={localBusinessSchema} />
      </head>
      <body className={cn("min-h-screen bg-app-bg font-sans antialiased", "pb-20 md:pb-0", inter.variable)}>
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
                    <BottomNavigation />
                  </AgeVerificationWrapper>
                </CartProvider>
              </AgeVerificationProvider>
            </Suspense>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  )
}
