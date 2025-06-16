import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { cities, formatCityName } from "@/lib/cities"
import { 
  MapPin, 
  Clock, 
  Shield, 
  Truck, 
  CheckCircle, 
  Phone, 
  CreditCard,
  AlertTriangle,
  Star,
  Navigation
} from "lucide-react"

export const metadata: Metadata = {
  title: "Weed Delivery Twin Cities & Suburbs in 1 Hour or Less | DankDealsMN",
  description: "Weed delivery anywhere in the Twin Cities & surrounding suburbs in 1 hour or less! Professional, discreet THC delivery with 21+ verification to 20+ metro cities.",
  keywords: [
    "cannabis delivery Minneapolis",
    "THC delivery St Paul", 
    "marijuana delivery Twin Cities",
    "weed delivery service areas",
    "cannabis delivery zones Minnesota",
    "THC delivery areas",
    "marijuana delivery Minneapolis metro"
  ],
  openGraph: {
    title: "Weed Delivery Twin Cities & Suburbs in 1 Hour or Less | DankDealsMN",
    description: "Weed delivery anywhere in the Twin Cities & surrounding suburbs in 1 hour or less! Professional, discreet service with 21+ verification.",
    type: "website",
    locale: "en_US",
    siteName: "DankDealsMN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weed Delivery Twin Cities & Suburbs in 1 Hour or Less | DankDealsMN",
    description: "Weed delivery anywhere in the Twin Cities & surrounding suburbs in 1 hour or less!",
  },
  alternates: {
    canonical: "/delivery",
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
}

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DeliveryService",
  "name": "DankDealsMN Cannabis Delivery",
  "description": "Professional cannabis delivery service covering Minneapolis, St. Paul and Twin Cities metropolitan area",
  "url": "https://dankdealsmn.com/delivery",
  "telephone": "+16129301390",
  "priceRange": "$$",
  "areaServed": cities.map(city => ({
    "@type": "City",
    "name": formatCityName(city),
    "addressRegion": "MN",
    "addressCountry": "US"
  })),
  "serviceType": "Cannabis Delivery",
  "hoursAvailable": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    "opens": "10:00",
    "closes": "22:00"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "44.9778",
    "longitude": "-93.2650"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+16129301390",
    "contactType": "Customer Service"
  }
}

export default function DeliveryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
        <Header />
        <main className="pt-20 pb-24">
          <div className="container mx-auto px-4 py-16 max-w-6xl">
            
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                <span className="text-app-green-600">Weed Delivery</span> anywhere in the Twin Cities and surrounding suburbs <span className="text-app-green-600">in one hour or less!</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Fast, discreet, and professional THC delivery across the Minneapolis-St. Paul metropolitan area. 
                Browse our premium selection and get it delivered directly to your door with secure 21+ verification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/menu">
                  <Button size="lg" className="primary-button px-8 py-4 text-lg">
                    Browse Menu & Order Now
                  </Button>
                </Link>
                <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
                  <Button size="lg" variant="outline" className="secondary-button px-8 py-4 text-lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Text to Order: (612) 930-1390
                  </Button>
                </a>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-4 gap-6 mb-16 animate-slide-up">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="h-8 w-8 text-app-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">Same-day delivery available</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-app-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Secure & Discreet</h3>
                  <p className="text-sm text-muted-foreground">Professional drivers, discreet packaging</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="h-8 w-8 text-app-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">21+ Verified</h3>
                  <p className="text-sm text-muted-foreground">Valid ID required, address verified</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CreditCard className="h-8 w-8 text-app-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Pre-Payment</h3>
                  <p className="text-sm text-muted-foreground">Secure payment for driver safety</p>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <section className="mb-16 animate-slide-up">
              <Card className="bg-white/10 backdrop-blur-sm border-app-green-200/30">
                <CardHeader>
                  <CardTitle className="text-3xl text-center flex items-center justify-center mb-4">
                    <Truck className="h-8 w-8 mr-3 text-app-green-600" />
                    How Our Delivery Service Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-app-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                      <h4 className="font-semibold text-lg mb-2">Browse & Select</h4>
                      <p className="text-muted-foreground">Explore our curated menu of premium cannabis products including flower, edibles, and vapes.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-app-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                      <h4 className="font-semibold text-lg mb-2">Text Your Order</h4>
                      <p className="text-muted-foreground">Send your complete order details to (612) 930-1390. Include your delivery address and preferred products.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-app-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                      <h4 className="font-semibold text-lg mb-2">Secure Payment</h4>
                      <p className="text-muted-foreground">Complete pre-payment through our secure system to ensure driver safety and order confirmation.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-app-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                      <h4 className="font-semibold text-lg mb-2">Fast Delivery</h4>
                      <p className="text-muted-foreground">Present your matching ID upon delivery. Enjoy your premium cannabis products responsibly!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Important Requirements */}
            <section className="mb-16 animate-slide-up">
              <Card className="bg-yellow-900/20 border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-300">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    Important Delivery Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-yellow-100">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-yellow-300 flex-shrink-0" />
                      <div>
                        <strong>Age Verification:</strong> Must be 21+ with valid state-issued photo ID
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-yellow-300 flex-shrink-0" />
                      <div>
                        <strong>Address Matching:</strong> ID address must match delivery location
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-yellow-300 flex-shrink-0" />
                      <div>
                        <strong>Pre-Payment Required:</strong> All orders must be paid before delivery for driver safety
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-yellow-300 flex-shrink-0" />
                      <div>
                        <strong>Service Hours:</strong> Daily delivery available from 10 AM to 10 PM
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Service Areas */}
            <section className="mb-16 animate-slide-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
                  <Navigation className="h-8 w-8 mr-3 text-app-green-600" />
                  Our Delivery Service Areas
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We proudly serve the entire Twin Cities metropolitan area with fast, professional cannabis delivery. 
                  Click on any city below for location-specific information and local delivery details.
                </p>
              </div>

              <Card className="bg-white/10 backdrop-blur-sm border-app-green-200/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Minneapolis-St. Paul Metro Area Coverage
                  </CardTitle>
                  <p className="text-center text-muted-foreground">
                    Professional THC delivery to {cities.length} cities and surrounding areas
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cities.map((citySlug) => (
                      <Link 
                        key={citySlug} 
                        href={`/delivery/${citySlug}`}
                        className="group"
                      >
                        <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:border-app-green-300">
                          <CardContent className="p-4 text-center">
                            <MapPin className="h-6 w-6 text-app-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-foreground group-hover:text-app-green-600 transition-colors">
                              {formatCityName(citySlug)}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              View delivery info →
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Featured Cities */}
            <section className="mb-16 animate-slide-up">
              <h3 className="text-2xl font-bold text-center mb-8">Primary Service Areas</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-app-green-600/20 to-app-green-800/20 border-app-green-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Star className="h-6 w-6 text-app-green-400 mr-2" />
                      <h4 className="text-xl font-bold">Minneapolis</h4>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Comprehensive coverage throughout Minneapolis including downtown, uptown, northeast, and all surrounding neighborhoods.
                    </p>
                    <Link href="/delivery/minneapolis">
                      <Button className="w-full primary-button">
                        View Minneapolis Delivery Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-app-green-600/20 to-app-green-800/20 border-app-green-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Star className="h-6 w-6 text-app-green-400 mr-2" />
                      <h4 className="text-xl font-bold">St. Paul</h4>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Full service coverage across St. Paul including downtown, highland park, como, and all metro neighborhoods.
                    </p>
                    <Link href="/delivery/st-paul">
                      <Button className="w-full primary-button">
                        View St. Paul Delivery Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="text-center animate-fade-in">
              <Card className="bg-gradient-to-r from-app-green-600/20 to-app-green-800/20 border-app-green-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Ready to Order Cannabis Delivery?
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Browse our premium selection of cannabis products and get same-day delivery 
                    to your door anywhere in the Twin Cities metro area.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/menu">
                      <Button size="lg" className="primary-button px-8 py-4">
                        Browse Our Menu
                      </Button>
                    </Link>
                    <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
                      <Button size="lg" variant="outline" className="secondary-button px-8 py-4">
                        <Phone className="mr-2 h-5 w-5" />
                        Text: (612) 930-1390
                      </Button>
                    </a>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Same-Day Delivery
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Secure & Discreet
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      21+ Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
} 