import { formatCityName } from "@/lib/cities"
import Disclaimer from "./disclaimer"
import { Button } from "./ui/button"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"

interface CityPageTemplateProps {
  city: string
}

export default function CityPageTemplate({ city }: CityPageTemplateProps) {
  const formattedCity = formatCityName(city)
  const mapQuery = encodeURIComponent(`${formattedCity}, MN`)
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${mapQuery}&zoom=11`

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Fast & Discreet THC Delivery in <span className="text-app-green-600">{formattedCity}</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          DankDeals is your #1 source for premium cannabis delivery in {formattedCity}. Browse our menu of top-shelf
          flower, edibles, and vapes, and get them delivered directly to your door.
        </p>
      </div>

      <Disclaimer />

      <div className="my-16 animate-slide-up">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center text-foreground">
          <MapPin className="h-8 w-8 mr-3 text-app-green-600" />
          Delivering to {formattedCity}
        </h2>
        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl border border-app-green-200">
          {/* 
            For production, ensure you have a Google Maps API key and that it's properly secured.
            You might want to consider loading the iframe lazily or using a placeholder.
          */}
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${formattedCity}, MN`}
          ></iframe>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Map showing approximate service area for {formattedCity}.
        </p>
      </div>

      <div className="text-center mt-16 animate-fade-in">
        <Link href="/menu">
          <Button size="lg" className="primary-button px-8 py-4 text-lg">
            Browse the {formattedCity} Menu <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="mt-24 space-y-12 animate-slide-up">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-app-green-200/30">
          <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose DankDeals for Weed Delivery in {formattedCity}?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're not just another delivery service. We're a team of cannabis enthusiasts dedicated to providing the
            best products and experience in the Twin Cities area. We offer a curated selection, competitive pricing, and
            a commitment to safe, professional service.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-app-green-200/30">
          <h3 className="text-2xl font-bold text-foreground mb-6">Our Simple Ordering Process</h3>
          <ol className="space-y-4 text-muted-foreground">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">1</span>
              <div>
                <span className="font-semibold text-foreground">Explore Our Menu:</span> Find the perfect products for
                your needs.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">2</span>
              <div>
                <span className="font-semibold text-foreground">Text Us Your Order:</span> Send your order details to
                (612) 930-1390.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">3</span>
              <div>
                <span className="font-semibold text-foreground">Pay & Verify:</span> Complete your pre-payment and get
                ready for delivery.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">4</span>
              <div>
                <span className="font-semibold text-foreground">Receive Your Delivery:</span> Present your matching ID and
                enjoy!
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
