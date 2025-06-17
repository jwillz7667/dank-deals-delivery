import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin } from "lucide-react"
import { cities, formatCityName } from "@/lib/cities" // Import the full list of cities

export default function Footer() {
  return (
    <footer className="bg-card text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/DANKDEALSMN.COM-LOGO.png"
                alt="DankDealsMN.com Logo"
                width={270}
                height={61}
                className="object-contain w-48 h-auto sm:w-52 md:w-56 lg:w-64 transition-all duration-300 hover:scale-105"
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
            <h4 className="font-bold text-lg text-foreground mb-4">Legal</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cannabis-compliance" className="hover:text-primary text-sm">
                  Cannabis Compliance
                </Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="hover:text-primary text-sm">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/return-refund-policy" className="hover:text-primary text-sm">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-primary text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-primary text-sm">
                  Accessibility
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
                      <p>&copy; {new Date().getFullYear()} DankDealsMN.com. All Rights Reserved.</p>
          <p className="mt-2 text-sm">
            21+ ONLY. For use by adults 21 years of age or older. Keep out of reach of children.
          </p>
        </div>
      </div>
    </footer>
  )
}
