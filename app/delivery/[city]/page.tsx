import { cities, formatCityName } from "@/lib/cities"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CityPageTemplate from "@/components/city-page-template"

interface CityPageProps {
  params: Promise<{
    city: string
  }>
}

// Generate metadata dynamically for each city page
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params
  const formattedCity = formatCityName(city)
  const title = `Weed Delivery in ${formattedCity} in One Hour or Less | DankDealsMN`
  const description = `Fast weed delivery in ${formattedCity}, MN in 1 hour or less! Professional cannabis delivery service with premium flower, edibles & vapes. 21+ verification required. Order now!`

  return {
    title,
    description,
    keywords: [
      `weed delivery ${formattedCity}`,
      `cannabis delivery ${formattedCity}`,
      `THC delivery ${formattedCity}`,
      `marijuana delivery ${formattedCity}`, 
      `${formattedCity} cannabis delivery`,
      `${formattedCity} weed delivery service`,
      `fast cannabis delivery ${formattedCity}`,
      `1 hour cannabis delivery ${formattedCity}`,
      `same day weed delivery ${formattedCity}`,
      `${formattedCity} Minnesota cannabis delivery`
    ],
    openGraph: {
      title: `Weed Delivery in ${formattedCity} in One Hour or Less | DankDealsMN`,
      description: `Fast weed delivery in ${formattedCity}, MN in 1 hour or less! Professional cannabis delivery with premium products. 21+ verification required.`,
      type: "website",
      locale: "en_US",
      siteName: "DankDealsMN",
      url: `https://dankdealsmn.com/delivery/${city}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Weed Delivery in ${formattedCity} in One Hour or Less`,
      description: `Fast weed delivery in ${formattedCity}, MN in 1 hour or less! Professional cannabis delivery service.`,
    },
    alternates: {
      canonical: `/delivery/${city}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": "MN",
      "geo.placename": `${formattedCity}, Minnesota`,
      "geo.position": "44.9778;-93.2650",
      "ICBM": "44.9778, -93.2650",
    },
  }
}

// Pre-render all city pages at build time
export async function generateStaticParams() {
  return cities.map((city) => ({
    city,
  }))
}

export default async function Page({ params }: CityPageProps) {
  const { city } = await params
  
  // Redirect if the city is not in our list (optional but good practice)
  if (!cities.includes(city)) {
    // In a real app, you might redirect to a 404 or a service area page
    // For now, we assume valid cities based on generateStaticParams
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
      <Header />
      <main className="pt-20 pb-24">
        <CityPageTemplate city={city} />
      </main>
      <Footer />
    </div>
  )
}
