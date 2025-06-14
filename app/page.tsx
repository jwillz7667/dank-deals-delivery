"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Leaf, Cookie, Cigarette, Heart, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { products } from "@/lib/products"
import JsonLd from "@/components/json-ld"
import { createProductSlug } from "@/lib/utils"

const categories = [
  { name: "Flower", icon: Leaf, href: "/menu?category=flower" },
  { name: "Edibles", icon: Cookie, href: "/menu?category=edibles" },
  { name: "Prerolls", icon: Cigarette, href: "/menu?category=prerolls" },
  { name: "Wellness", icon: Heart, href: "/menu?category=wellness" },
  { name: "More", icon: Plus, href: "/menu" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Get featured products (6 for mobile, 8 for desktop)
  const featuredProducts = products.slice(0, 8)

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "DankDealsMN - Premium Cannabis Delivery in Minneapolis",
    description: "Discover DankDealsMN, your top choice for premium cannabis delivery in Minneapolis & St. Paul. Text to order at (612) 930-1390.",
    url: "https://dankdealsmn.com/",
    isPartOf: {
      "@type": "WebSite",
      url: "https://dankdealsmn.com/",
      name: "DankDealsMN",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
      <JsonLd data={homePageSchema} />
      <Header />
      
      <main className="pt-20 pb-24 px-4">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="max-w-sm mx-auto space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative animate-fade-in">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="I'm willing to find..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input pl-12 pr-12 h-12 text-base shadow-lg"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-app-green-100 rounded-full transition-all duration-300 hover:scale-110 gpu-accelerated"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-app-green-600" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </Button>
            </form>

            {/* Categories */}
            <div className="animate-slide-up">
              <h2 className="text-xl font-semibold text-foreground mb-4">Categories</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {categories.slice(0, 4).map((category, index) => {
                  const Icon = category.icon
                  return (
                    <Link key={category.name} href={category.href}>
                      <div className="category-tile h-20 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <Icon className="h-6 w-6 mb-1" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="flex justify-center">
                <Link href="/menu">
                  <div className="category-tile w-20 h-20 animate-scale-in" style={{ animationDelay: '400ms' }}>
                    <Plus className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">More</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Featured Product Banner */}
            {featuredProducts[0] && (
              <Link href={`/product/${createProductSlug(featuredProducts[0].name)}`}>
                <Card className="relative overflow-hidden bg-gradient-to-r from-app-green-600 to-app-green-700 text-white animate-fade-in floating-effect">
                  <CardContent className="p-6 pr-32">
                    <h3 className="text-2xl font-bold mb-2">{featuredProducts[0].name}</h3>
                    <p className="text-white/90">
                      From ${featuredProducts[0].pricing?.[0]?.price || '25.50'}
                    </p>
                  </CardContent>
                  <div className="absolute right-4 top-4 bottom-4 w-24 opacity-80">
                    <Image
                      src={featuredProducts[0].imageUrl}
                      alt={featuredProducts[0].name}
                      fill
                      className="object-cover object-center rounded-xl"
                      sizes="96px"
                    />
                  </div>
                </Card>
              </Link>
            )}

            {/* Hot Right Now */}
            <div className="animate-slide-up">
              <h2 className="text-xl font-semibold text-foreground mb-4">Hot right now</h2>
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.slice(1, 5).map((product, index) => (
                  <Card key={product.id} className="product-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-3">
                      <Link href={`/product/${createProductSlug(product.name)}`}>
                        <div className="aspect-square relative mb-3 rounded-xl overflow-hidden bg-white shadow-md">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 150px, 200px"
                          />
                        </div>
                      </Link>
                      <div className="text-center">
                        <p className="text-xs text-app-green-600 font-medium mb-1">
                          {product.category}
                        </p>
                        <Link href={`/product/${createProductSlug(product.name)}`}>
                          <h3 className="font-semibold text-sm text-foreground mb-1 hover:text-app-green-600 transition-colors duration-200">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mb-2">
                          From ${product.pricing?.[0]?.price || '25.50'}
                        </p>
                        <a href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}>
                          <Button className="w-full primary-button text-xs h-8">
                            Order Now
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Login Prompt for Guest Users */}
            <Card className="text-center p-6 card-glass animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-app-green-600 to-app-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                <Leaf className="h-8 w-8 text-white" />
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

            {/* Contact to Order */}
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
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-12 animate-fade-in">
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* Left side - Search and main content */}
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

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative max-w-lg animate-slide-up" style={{ animationDelay: '400ms' }}>
                      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="I'm willing to find..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input pl-16 pr-16 h-16 text-lg shadow-xl"
                      />
                      <Button 
                        type="submit" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 primary-button h-12 px-6"
                      >
                        Search
                      </Button>
                    </form>

                    {/* CTA Buttons */}
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

                {/* Right side - Featured Product */}
                <div className="col-span-5">
                  {featuredProducts[0] && (
                    <Link href={`/product/${createProductSlug(featuredProducts[0].name)}`}>
                      <Card className="relative overflow-hidden bg-gradient-to-br from-app-green-600 to-app-green-700 text-white animate-scale-in h-80 floating-effect hover-glow">
                        <CardContent className="p-8">
                          <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">{featuredProducts[0].name}</h3>
                            <p className="text-white/90 text-lg mb-4">
                              From ${featuredProducts[0].pricing?.[0]?.price || '25.50'}
                            </p>
                            <Button className="secondary-button">
                              View Product
                            </Button>
                          </div>
                          <div className="absolute -right-8 -top-8 w-64 h-64 opacity-20">
                            <Image
                              src={featuredProducts[0].imageUrl}
                              alt={featuredProducts[0].name}
                              fill
                              className="object-cover object-center"
                              sizes="256px"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div className="mb-12 animate-slide-up">
              <h2 className="text-3xl font-semibold text-foreground mb-8">Shop by Category</h2>
              <div className="grid grid-cols-4 gap-6">
                {categories.slice(0, 4).map((category, index) => {
                  const Icon = category.icon
                  return (
                    <Link key={category.name} href={category.href}>
                      <div className="category-tile h-32 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <Icon className="h-8 w-8 mb-2" />
                        <span className="text-lg font-medium">{category.name}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Products Section */}
            <div className="mb-12 animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold text-foreground">Hot Right Now</h2>
                <Link href="/menu">
                  <Button variant="outline" className="secondary-button">
                    View All Products
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {featuredProducts.slice(1, 7).map((product, index) => (
                  <Card key={product.id} className="product-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4">
                      <Link href={`/product/${createProductSlug(product.name)}`}>
                        <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-white shadow-md">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 1024px) 200px, 250px"
                          />
                        </div>
                      </Link>
                      <div className="text-center">
                        <p className="text-sm text-app-green-600 font-medium mb-2">
                          {product.category}
                        </p>
                        <Link href={`/product/${createProductSlug(product.name)}`}>
                          <h3 className="font-semibold text-base text-foreground mb-2 hover:text-app-green-600 transition-colors duration-200">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                          From ${product.pricing?.[0]?.price || '25.50'}
                        </p>
                        <a href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}>
                          <Button className="w-full primary-button">
                            Order Now
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="grid grid-cols-2 gap-8 animate-slide-up">
              {/* Login Card */}
              <Card className="text-center p-8 card-glass">
                <div className="w-20 h-20 bg-gradient-to-br from-app-green-600 to-app-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Create Your Account
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of satisfied customers across the Twin Cities
                </p>
                <div className="space-y-4">
                  <Link href="/handler/sign-in">
                    <Button className="primary-button w-full">
                      Log In
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/handler/sign-up" className="text-app-green-600 font-medium hover:underline transition-all duration-200">
                      Sign Up Free
                    </Link>
                  </p>
                </div>
              </Card>

              {/* Contact Card */}
              <Card className="glass-card border-app-green-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-semibold text-app-green-800 mb-4">Ready to Order?</h3>
                  <p className="text-app-green-700 mb-6">
                    Text or call us to complete your order.<br />
                    We're here 7 days a week.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
                      <Button className="w-full primary-button">
                        Text to Order
                      </Button>
                    </a>
                    <a href="tel:+16129301390">
                      <Button variant="outline" className="w-full secondary-button">
                        Call Now
                      </Button>
                    </a>
                  </div>
                  <p className="text-lg text-app-green-600 font-bold">
                    📞 (612) 930-1390
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
