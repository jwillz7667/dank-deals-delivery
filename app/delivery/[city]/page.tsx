import { cities, formatCityName } from "@/lib/cities"
import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CityPageTemplate from "@/components/city-page-template"

interface CityPageProps {
  params: Promise<{
    city: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params
  const formattedCity = formatCityName(city)
  
  return {
    title: `Weed Delivery in ${formattedCity} in One Hour or Less | DankDealsMN`,
    description: `Fast weed delivery in ${formattedCity}, MN in 1 hour or less! Professional cannabis delivery service with premium flower, edibles & vapes. 21+ verification required. Order now!`,
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
  const cityName = city || "minneapolis"
  
  // Redirect if the city is not in our list (optional but good practice)
  if (!cities.includes(cityName)) {
    // In a real app, you might redirect to a 404 or a service area page
    // For now, we assume valid cities based on generateStaticParams
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
      <Header />
      <main className="pt-20 pb-24">
        <CityPageTemplate city={cityName} />
      </main>
      <Footer />
    </div>
  )
}
