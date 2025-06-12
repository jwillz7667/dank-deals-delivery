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
  // IMPORTANT: Replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mapQuery}&zoom=11`

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center">
        Fast & Discreet THC Delivery in <span className="text-primary">{formattedCity}</span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground text-center max-w-2xl mx-auto">
        DankDeals is your #1 source for premium cannabis delivery in {formattedCity}. Browse our menu of top-shelf
        flower, edibles, and vapes, and get them delivered directly to your door.
      </p>

      <Disclaimer />

      <div className="my-12">
        <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
          <MapPin className="h-8 w-8 mr-3 text-primary" />
          Delivering to {formattedCity}
        </h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl border border-border">
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

      <div className="text-center mt-12">
        <Link href="/menu">
          <Button size="lg" className="neumorphic-outset">
            Browse the {formattedCity} Menu <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="mt-20 text-left space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Why Choose DankDeals for Weed Delivery in {formattedCity}?</h2>
          <p className="mt-4 text-muted-foreground">
            We're not just another delivery service. We're a team of cannabis enthusiasts dedicated to providing the
            best products and experience in the Twin Cities area. We offer a curated selection, competitive pricing, and
            a commitment to safe, professional service.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Our Simple Ordering Process</h3>
          <ol className="list-decimal list-inside mt-4 space-y-2 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">Explore Our Menu:</span> Find the perfect products for
              your needs.
            </li>
            <li>
              <span className="font-semibold text-foreground">Text Us Your Order:</span> Send your order details to
              (612) 930-1390.
            </li>
            <li>
              <span className="font-semibold text-foreground">Pay & Verify:</span> Complete your pre-payment and get
              ready for delivery.
            </li>
            <li>
              <span className="font-semibold text-foreground">Receive Your Delivery:</span> Present your matching ID and
              enjoy!
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
