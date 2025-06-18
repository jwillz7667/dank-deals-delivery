"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Leaf, Cookie, Cigarette, Heart, Pill, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { products } from "@/lib/products"
import JsonLd from "@/components/json-ld"
import { createProductSlug } from "@/lib/utils"
import CyclingImage from "@/components/ui/cycling-image"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

const categories = [
  { name: "Flower", icon: Leaf, href: "/menu?category=flower" },
  { name: "Edibles", icon: Cookie, href: "/menu?category=edibles" },
  { name: "Prerolls", icon: Cigarette, href: "/menu?category=prerolls" },
  { name: "Wellness", icon: Heart, href: "/menu?category=wellness" },
  { name: "Vapes", icon: Sparkles, href: "/menu?category=vapes" },
  { name: "Concentrates", icon: Pill, href: "/menu?category=concentrates" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const featuredProducts = products.slice(0, 6)

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "DankDealsMN.com - Premium Cannabis Delivery in Minneapolis & St. Paul",
    description: "Twin Cities' fastest cannabis delivery service. Premium flower, edibles, and vapes delivered in under 30 minutes. Text to order: (612) 930-1390",
    url: "https://dankdealsmn.com/",
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
    isPartOf: {
      "@type": "WebSite",
      url: "https://dankdealsmn.com/",
      name: "DankDealsMN.com",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent">
      <JsonLd data={homePageSchema} />
      <Header />
      
      <main className="pt-20 pb-24 px-4">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="max-w-sm mx-auto space-y-10">
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

            {/* Delivery CTA */}
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

            {/* Categories Swiper */}
``            <div className="animate-slide-up mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Categories</h2>
              <Swiper
                slidesPerView="auto"
                spaceBetween={12}
                freeMode={true}
                modules={[FreeMode]}
                className="category-swiper"
              >
                {categories.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <SwiperSlide key={category.name} className="!w-auto">
                      <Link href={category.href}>
                        <div 
                          className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl text-white text-xs font-medium transition-all duration-300 hover:scale-105 floating-effect gpu-accelerated animate-scale-in shadow-xl backdrop-blur-lg border border-white/20"
                          style={{ 
                            background: 'linear-gradient(135deg, #2B5D3F 0%, #225031 100%)',
                            animationDelay: `${index * 100}ms` 
                          }}
                        >
                          <Icon className="h-5 w-5 mb-1" />
                          <span className="text-center leading-tight">{category.name}</span>
                        </div>
                      </Link>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>

            {/* Hot Right Now */}
            <div className="animate-slide-up">
              <h2 className="text-xl font-semibold text-foreground mb-6">Hot right now</h2>
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <Card key={product.id} className="product-card animate-slide-up h-full" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-3 h-full flex flex-col">
                      <Link href={`/product/${createProductSlug(product.name)}`}>
                        <div className="aspect-square relative mb-3 rounded-xl overflow-hidden bg-white shadow-md">
                          {product.images && product.images.length > 1 ? (
                            <CyclingImage
                              images={product.images}
                              alt={product.name}
                              priority={index === 0}
                              sizes="(max-width: 768px) 180px, 250px"
                            />
                          ) : (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover hover:scale-110 transition-transform duration-300"
                              priority={index === 0}
                              sizes="(max-width: 768px) 180px, 250px"
                            />
                          )}
                        </div>
                      </Link>
                      <div className="text-center flex flex-col h-full">
                        <p className="text-xs text-app-green-600 font-medium mb-1">
                          {product.category}
                        </p>
                        <Link href={`/product/${createProductSlug(product.name)}`}>
                          <h3 className="font-semibold text-sm text-foreground mb-2 hover:text-app-green-600 transition-colors duration-200 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex-grow flex flex-col justify-end">
                          <p className="text-lg font-bold text-app-green-600 mb-3">
                            ${product.pricing?.[0]?.price || '25.50'}
                          </p>
                          <a href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}>
                            <Button className="w-full primary-button text-xs h-8">
                              Order Now
                            </Button>
                          </a>
                        </div>
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
            <div className="mb-16 animate-fade-in">
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

                {/* Right side - Contact CTA */}
                <div className="col-span-5">
                  <Card className="glass-card border-app-green-200 h-80">
                    <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                      <h3 className="text-3xl font-bold text-app-green-800 mb-4">Ready to Order?</h3>
                      <p className="text-app-green-700 mb-6 text-lg">
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
                      <p className="text-xl text-app-green-600 font-bold">
                        📞 (612) 930-1390
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="mb-16 animate-slide-up">
              <Card className="bg-gradient-to-r from-app-green-600/10 to-app-green-800/10 border-app-green-300/50">
                <CardContent className="p-8">
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-8">
                      <div className="flex items-center mb-4">
                                                 <div className="w-16 h-16 bg-gradient-to-br from-app-green-600 to-app-green-700 rounded-2xl flex items-center justify-center mr-4 animate-float">
                           <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                             <path d="M20 8V7c0-1.1-.9-2-2-2H2v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5h-3l-1-6zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                           </svg>
                         </div>
                        <div>
                          <h2 className="text-3xl font-bold text-foreground">Fast Delivery Available!</h2>
                          <p className="text-lg text-app-green-600 font-semibold">Weed delivery anywhere in the Twin Cities & suburbs in 1 hour or less!</p>
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6">
                        We deliver to over 20 cities across the Minneapolis-St. Paul metro area. Professional, discreet, and fast service with 21+ verification.
                      </p>
                      <div className="flex gap-4">
                        <Link href="/delivery">
                          <Button className="primary-button px-8 py-3 text-lg">
                            View All Delivery Areas
                          </Button>
                        </Link>
                        <a href="sms:+16129301390?&body=Hi! I'd like to place a delivery order.">
                          <Button variant="outline" className="secondary-button px-8 py-3 text-lg">
                            Order for Delivery
                          </Button>
                        </a>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                        <h3 className="text-xl font-semibold text-foreground mb-4">Service Areas Include:</h3>
                        <div className="space-y-2 text-muted-foreground">
                          <p>• Minneapolis & St. Paul</p>
                          <p>• Bloomington & Edina</p>
                          <p>• Plymouth & Minnetonka</p>
                          <p>• Maple Grove & Eden Prairie</p>
                          <p className="text-app-green-600 font-medium">+ 15 more cities</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories Section */}
            <div className="mb-24 animate-slide-up">
              <h2 className="text-3xl font-semibold text-foreground mb-12">Shop by Category</h2>
              <Swiper
                slidesPerView="auto"
                spaceBetween={24}
                freeMode={true}
                modules={[FreeMode]}
                className="category-swiper-desktop"
              >
                {categories.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <SwiperSlide key={category.name} className="!w-auto">
                      <Link href={category.href}>
                        <div 
                          className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl text-white text-lg font-medium transition-all duration-300 hover:scale-105 floating-effect gpu-accelerated animate-scale-in shadow-xl backdrop-blur-lg border border-white/20"
                          style={{ 
                            background: 'linear-gradient(135deg, #2B5D3F 0%, #225031 100%)',
                            animationDelay: `${index * 100}ms` 
                          }}
                        >
                          <Icon className="h-8 w-8 mb-2" />
                          <span className="text-center leading-tight">{category.name}</span>
                        </div>
                      </Link>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>

            {/* Products Section */}
            <div className="mb-16 animate-slide-up">
                              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-semibold text-foreground">Hot Right Now</h2>
                <Link href="/menu">
                  <Button variant="outline" className="secondary-button">
                    View All Products
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {featuredProducts.slice(0, 6).map((product, index) => (
                  <Card key={product.id} className="product-card animate-slide-up h-full" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4 h-full flex flex-col">
                      <Link href={`/product/${createProductSlug(product.name)}`}>
                        <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-white shadow-md">
                          {product.images && product.images.length > 1 ? (
                            <CyclingImage
                              images={product.images}
                              alt={product.name}
                              priority={index < 2}
                              sizes="(max-width: 1024px) 200px, 250px"
                            />
                          ) : (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover hover:scale-110 transition-transform duration-300"
                              priority={index < 2}
                              sizes="(max-width: 1024px) 200px, 250px"
                            />
                          )}
                        </div>
                      </Link>
                      <div className="text-center flex flex-col h-full">
                        <p className="text-sm text-app-green-600 font-medium mb-2">
                          {product.category}
                        </p>
                        <Link href={`/product/${createProductSlug(product.name)}`}>
                          <h3 className="font-semibold text-base text-foreground mb-3 hover:text-app-green-600 transition-colors duration-200 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex-grow flex flex-col justify-end">
                          <p className="text-xl font-bold text-app-green-600 mb-4">
                            ${product.pricing?.[0]?.price || '25.50'}
                          </p>
                          <a href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}>
                            <Button className="w-full primary-button">
                              Order Now
                            </Button>
                          </a>
                        </div>
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
