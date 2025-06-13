import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin } from "lucide-react"
import { cities, formatCityName } from "@/lib/cities" // Import the full list of cities

export default function Footer() {
  return (
    <footer className="bg-card text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/dankdeals-logo.png"
                alt="DankDeals.org Logo"
                width={200}
                height={45}
                className="object-contain w-40 h-9 sm:w-44 sm:h-10 md:w-48 md:h-11 lg:w-52 lg:h-12"
              />
            </Link>
            <p className="text-muted-foreground text-sm">40 years experience, 'legally' since 2022.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <a href="sms:+16129301390" className="hover:text-primary">
                  Text to Order: (612) 930-1390
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Minneapolis-St. Paul, MN</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/mission" className="hover:text-primary">
                  Our Mission
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-foreground mb-4">Service Areas</h4>
            {/* Make the list scrollable if it gets too long */}
            <ul className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
              {cities.map((citySlug) => (
                <li key={citySlug}>
                  <Link href={`/delivery/${citySlug}`} className="hover:text-primary text-sm">
                    {formatCityName(citySlug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/50 pt-8 text-center text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} DankDeals.org. All Rights Reserved.</p>
          <p className="mt-2 text-sm">
            21+ ONLY. For use by adults 21 years of age or older. Keep out of reach of children.
          </p>
        </div>
      </div>
    </footer>
  )
}
