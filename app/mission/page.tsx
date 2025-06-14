// This can be a Server Component
import Header from "@/components/header"
import MissionSection from "@/components/mission-section"
import Footer from "@/components/footer"
import JsonLd from "@/components/json-ld"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Mission - DankDealsMN.com | Community & Quality Cannabis",
  description:
    "Learn about the mission and values of DankDealsMN.com. We're committed to quality, community, and innovation in cannabis delivery for Minneapolis & St. Paul.",
  alternates: {
    canonical: "/mission",
  },
}

export default function MissionPage() {
  const missionPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title as string,
    description: metadata.description as string,
    url: "https://dankdealsmn.com/mission",
    isPartOf: {
      "@type": "WebSite",
              url: "https://dankdealsmn.com/",
        name: "DankDealsMN.com",
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <JsonLd data={missionPageSchema} />
      <Header />
      <main className="pt-20">
        <MissionSection />
      </main>
      <Footer />
    </div>
  )
}
