"use client"

import { useState, memo, Suspense, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon, LeafIcon } from "@/lib/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Lazy load heavy components
const CategoriesSection = dynamic(() => import('./categories-section'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-32"></div>
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-300 rounded-2xl"></div>
        ))}
      </div>
    </div>
  ),
  ssr: false
})

const FeaturedProducts = dynamic(() => import('./featured-products'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-40"></div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-300 rounded-xl"></div>
        ))}
      </div>
    </div>
  ),
  ssr: false
})

interface HeroSectionProps {
  isMobile?: boolean
}

const SearchForm = memo(function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative animate-fade-in">
      <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} />
      <Input
        type="text"
        placeholder="I'm willing to find..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input pl-12 pr-12 h-12 text-base shadow-lg"
      />
      <Button 
        type="submit"
        variant="ghost" 
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-app-green-100 rounded-full transition-all duration-300 hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-app-green-600" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </Button>
    </form>
  )
})

const DeliveryCTA = memo(function DeliveryCTA() {
  return (
    <Card className="glass-card border-app-green-200 animate-fade-in mb-8">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-app-green-600 to-app-green-700 rounded-xl flex items-center justify-center mr-3 animate-float">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8V7c0-1.1-.9-2-2-2H2v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5h-3l-1-6zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-app-green-800">Fast Delivery Available!</h3>
        </div>
        <p className="text-sm text-app-green-700 mb-4">
          Weed delivery anywhere in the Twin Cities & suburbs in 1 hour or less!
        </p>
        <Link href="/delivery">
          <Button className="primary-button w-full">
            View All Delivery Areas
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
})

const LoginPrompt = memo(function LoginPrompt() {
  return (
    <Card className="text-center p-6 card-glass animate-fade-in">
      <div className="w-16 h-16 bg-gradient-to-br from-app-green-600 to-app-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
        <LeafIcon size={32} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Login and find great weed near you
      </h3>
      <div className="space-y-3 mt-6">
        <Link href="/handler/sign-in">
          <Button className="primary-button w-full">
            Log in
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/handler/sign-up" className="text-app-green-600 font-medium hover:underline transition-all duration-200">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  )
})

const ContactCTA = memo(function ContactCTA() {
  return (
    <Card className="glass-card border-app-green-200 animate-fade-in">
      <CardContent className="p-4 text-center">
        <h3 className="font-semibold text-app-green-800 mb-2">Ready to Order?</h3>
        <p className="text-sm text-app-green-700 mb-4">
          Text or call us to complete your order
        </p>
        <div className="flex gap-2">
          <a href="sms:+16129301390?&body=Hi! I'd like to place an order." className="flex-1">
            <Button className="w-full primary-button">
              Text to Order
            </Button>
          </a>
          <a href="tel:+16129301390" className="flex-1">
            <Button variant="outline" className="w-full secondary-button">
              Call Now
            </Button>
          </a>
        </div>
        <p className="text-xs text-app-green-600 font-medium mt-2">
          📞 (612) 930-1390
        </p>
      </CardContent>
    </Card>
  )
})

export default function HeroSection({ isMobile = false }: HeroSectionProps) {
  
  // Hide server-rendered placeholders when this component mounts
  useEffect(() => {
    const mobilePlaceholder = document.getElementById('lcp-placeholder')
    const desktopPlaceholder = document.getElementById('lcp-placeholder-desktop')
    
    if (mobilePlaceholder) {
      mobilePlaceholder.style.display = 'none'
    }
    if (desktopPlaceholder) {
      desktopPlaceholder.style.display = 'none'
    }
  }, [])

  if (isMobile) {
    return (
      <div className="max-w-sm mx-auto space-y-10">
        <SearchForm />
        <DeliveryCTA />
        
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-32"></div>
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-300 rounded-2xl flex-shrink-0"></div>
              ))}
            </div>
          </div>
        }>
          <CategoriesSection />
        </Suspense>

        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-40"></div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        }>
          <FeaturedProducts limit={4} />
        </Suspense>

        <LoginPrompt />
        <ContactCTA />
      </div>
    )
  }

  // Desktop version - server rendered where possible
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-16 animate-fade-in">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-4 animate-slide-up">
                  Premium Cannabis
                  <br />
                  <span className="text-app-green-600 animate-glow">Delivered Fresh</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  Minneapolis & St. Paul's most trusted cannabis delivery service
                </p>
              </div>

              <div className="max-w-lg animate-slide-up" style={{ animationDelay: '400ms' }}>
                <SearchForm />
              </div>

              <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '600ms' }}>
                <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
                  <Button className="primary-button px-8 py-3 text-lg animate-glow">
                    Text to Order
                  </Button>
                </a>
                <a href="tel:+16129301390">
                  <Button variant="outline" className="secondary-button px-8 py-3 text-lg">
                    Call (612) 930-1390
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-5">
            <ContactCTA />
          </div>
        </div>
      </div>
    </div>
  )
}
