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

  // JSON-LD structured data for local SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `DankDealsMN Cannabis Delivery - ${formattedCity}`,
    "description": `Fast weed delivery in ${formattedCity}, MN in 1 hour or less. Professional cannabis delivery service with premium flower, edibles and vapes.`,
    "url": `https://dankdealsmn.com/delivery/${city}`,
    "telephone": "+16129301390",
    "priceRange": "$$",
    "serviceType": "Cannabis Delivery",
    "areaServed": {
      "@type": "City",
      "name": formattedCity,
      "addressRegion": "MN",
      "addressCountry": "US"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": formattedCity,
      "addressRegion": "MN",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "44.9778",
      "longitude": "-93.2650"
    },
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "10:00",
      "closes": "22:00"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+16129301390",
      "contactType": "Customer Service"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cannabis Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Cannabis Flower"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Cannabis Edibles"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product", 
            "name": "Cannabis Vapes"
          }
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          <span className="text-app-green-600">Weed Delivery</span> in {formattedCity} <span className="text-app-green-600">in One Hour or Less!</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          DankDeals delivers premium cannabis directly to your door in {formattedCity} within 1 hour. Browse our menu of top-shelf
          flower, edibles, and vapes for fast, discreet delivery with professional 21+ verification.
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
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready for 1-Hour Delivery to {formattedCity}?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/menu">
          <Button size="lg" className="primary-button px-8 py-4 text-lg">
                Browse Menu for {formattedCity} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
            <a href={`sms:+16129301390?&body=Hi! I'd like weed delivery to ${formattedCity} in 1 hour or less.`}>
              <Button size="lg" variant="outline" className="secondary-button px-8 py-4 text-lg">
                Text to Order Now
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-24 space-y-12 animate-slide-up">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-app-green-200/30">
          <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose DankDeals for Weed Delivery in {formattedCity}?</h2>
          <div className="space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
              We're the fastest cannabis delivery service in {formattedCity}, delivering premium products in one hour or less. 
              Our professional drivers provide discreet, reliable service with 21+ verification at your door.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-app-green-600">⚡</div>
                <p className="font-semibold text-foreground">1 Hour or Less</p>
                <p className="text-sm text-muted-foreground">Fast delivery guaranteed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-app-green-600">🔒</div>
                <p className="font-semibold text-foreground">21+ Verified</p>
                <p className="text-sm text-muted-foreground">Professional ID checking</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-app-green-600">🌿</div>
                <p className="font-semibold text-foreground">Premium Quality</p>
                <p className="text-sm text-muted-foreground">Top-shelf products only</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-app-green-200/30">
          <h3 className="text-2xl font-bold text-foreground mb-6">Get Your Weed Delivered in {formattedCity} - 1 Hour or Less!</h3>
          <ol className="space-y-4 text-muted-foreground">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">1</span>
              <div>
                <span className="font-semibold text-foreground">Browse Our Menu:</span> Choose from premium flower, edibles, vapes, and more - all available for delivery to {formattedCity}.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">2</span>
              <div>
                <span className="font-semibold text-foreground">Text Your Order:</span> Send your complete order details to (612) 930-1390 with your {formattedCity} delivery address.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">3</span>
              <div>
                <span className="font-semibold text-foreground">Secure Payment:</span> Complete pre-payment through our secure system for driver safety and order confirmation.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-app-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">4</span>
              <div>
                <span className="font-semibold text-foreground">1-Hour Delivery:</span> Present your matching ID when we arrive at your {formattedCity} location in one hour or less!
              </div>
            </li>
          </ol>
          <div className="mt-8 text-center">
            <a href={`sms:+16129301390?&body=Hi! I'd like to place a delivery order to ${formattedCity}.`}>
              <Button className="primary-button px-8 py-3 text-lg">
                Order Delivery to {formattedCity} Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
