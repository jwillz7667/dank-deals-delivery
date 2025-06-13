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

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url), // Important for resolving relative paths in metadata
  title: {
    default: siteConfig.name,
    template: `%s | DankDeals.org`, // Simplified template
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "DankDeals.org", url: siteConfig.url }],
  creator: "DankDeals.org",
  publisher: "DankDeals.org",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: { default: siteConfig.name, template: `%s | DankDeals.org` },
    description: siteConfig.description,
    siteName: "DankDeals.org",
    images: [
      {
        url: "/og-image.png", // Relative to metadataBase
        width: 1200,
        height: 630,
        alt: "DankDeals.org - Premier Cannabis Gifting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: { default: siteConfig.name, template: `%s | DankDeals.org` },
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`], // Absolute URL for Twitter
    creator: "@dankdeals", // Replace with actual Twitter handle if available
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
        color: "#1a202c"
      }
    ]
  },
  manifest: "/my-favicon/site.webmanifest", // Relative to metadataBase
  alternates: {
    canonical: "/",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DankDeals.org",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`, // Assuming you have a logo.png in public
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-612-930-1390",
      contactType: "Customer Service",
      areaServed: "US", // Or more specific like "Minneapolis", "St. Paul"
      availableLanguage: "en",
    },
    sameAs: [
      // Add social media links if available
      // "https://www.facebook.com/dankdeals",
      // "https://www.instagram.com/dankdeals",
    ],
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DankDeals.org",
    url: siteConfig.url,
    image: `${siteConfig.url}/og-image.png`,
    telephone: "+16129301390",
    description: "A showcase for premium cannabis products available for gifting in the Twin Cities.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Minneapolis",
      addressRegion: "MN",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "44.9778", // Minneapolis latitude
      longitude: "-93.2650", // Minneapolis longitude
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
        // Example: first 5 products
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: `${siteConfig.url}${product.imageUrl.startsWith("/") ? product.imageUrl : "/" + product.imageUrl}`,
          category: product.category,
        },
      })),
    },
    openingHoursSpecification: [
      // Example, adjust as needed
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={localBusinessSchema} />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", "pb-16 md:pb-0", inter.variable)}><StackProvider app={stackServerApp}><StackTheme>
        <CartProvider>
          {children}
          <Toaster />
          <BottomNavigation />
        </CartProvider>
      </StackTheme></StackProvider></body>
    </html>
  )
}
