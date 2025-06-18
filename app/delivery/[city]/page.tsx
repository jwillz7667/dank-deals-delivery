"use client"

import { cities, formatCityName } from "@/lib/cities"
import { useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CityPageTemplate from "@/components/city-page-template"

interface CityPageProps {
  params: {
    city: string
  }
}



// Pre-render all city pages at build time
export async function generateStaticParams() {
  return cities.map((city) => ({
    city,
  }))
}

export default function Page({ params }: CityPageProps) {
  const city = params?.city || "minneapolis"
  const formattedCity = formatCityName(city)
  
  useEffect(() => {
    document.title = `Weed Delivery in ${formattedCity} in One Hour or Less | DankDealsMN`
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', `Fast weed delivery in ${formattedCity}, MN in 1 hour or less! Professional cannabis delivery service with premium flower, edibles & vapes. 21+ verification required. Order now!`)
    }
  }, [formattedCity])
  
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
