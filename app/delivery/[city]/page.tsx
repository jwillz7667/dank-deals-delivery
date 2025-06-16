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
  const title = `THC delivery in ${formattedCity}`
  const description = `Get fast, reliable, and discreet cannabis delivery in ${formattedCity}, MN. DankDeals offers a wide selection of flower, edibles, and vapes. Order now!`

  return {
    title,
    description,
    alternates: {
      canonical: `/delivery/${city}`,
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
