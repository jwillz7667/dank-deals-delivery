"use client"

import { useState } from "react"
import { products, type Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MessageSquare, Search, Leaf, Cookie, Cigarette, Heart, Pill, Sparkles } from "lucide-react"
import Link from "next/link"
import { createProductSlug } from "@/lib/utils"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'

interface MenuSectionProps {
  onProductClick: (product: Product) => void
}

const categories = [
  { name: "All", icon: null },
  { name: "Flower", icon: Leaf },
  { name: "Edibles", icon: Cookie },
  { name: "Prerolls", icon: Cigarette },
  { name: "Wellness", icon: Heart },
  { name: "Vapes", icon: Sparkles },
  { name: "Concentrates", icon: Pill },
]

export default function MenuSection({ onProductClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="px-4 bg-gradient-to-br from-app-bg via-app-secondary to-app-accent min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="max-w-sm mx-auto space-y-10">
          {/* Search Bar */}
          <div className="relative animate-fade-in">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="I'm willing to find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-12 h-12 text-base shadow-lg"
            />
          </div>

          {/* Categories Swiper */}
          <div className="animate-slide-up mb-8">
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
                const isActive = activeCategory === category.name
                return (
                  <SwiperSlide key={category.name} className="!w-auto">
                    <Button
                      onClick={() => setActiveCategory(category.name)}
                      className={cn(
                        "flex flex-col items-center justify-center w-20 h-20 rounded-2xl text-white text-xs font-medium transition-all duration-300 hover:scale-105 floating-effect gpu-accelerated animate-scale-in shadow-xl backdrop-blur-lg border border-white/20",
                        isActive ? "scale-105" : ""
                      )}
                      style={{ 
                        background: isActive 
                          ? 'linear-gradient(135deg, #225031 0%, #1A3E26 100%)' 
                          : 'linear-gradient(135deg, #2B5D3F 0%, #225031 100%)',
                        animationDelay: `${index * 100}ms` 
                      }}
                    >
                      {Icon && <Icon className="h-5 w-5 mb-1" />}
                      {!Icon && <span className="text-lg font-bold mb-1">All</span>}
                      <span className="text-center leading-tight">{category.name}</span>
                    </Button>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>



          {/* Products Grid */}
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {searchQuery ? `Search Results` : activeCategory === "All" ? "All Products" : activeCategory}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="product-card animate-slide-up h-full" 
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-3 h-full flex flex-col">
                    <Link href={`/product/${createProductSlug(product.name)}`}>
                      <div className="aspect-square relative mb-3 rounded-xl overflow-hidden bg-white shadow-md">
                        <Image
                          src={product.imageUrl}
                          alt={product.imageAlt || product.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-110"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                        {product.soldOut && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg font-bold text-xs shadow-lg">
                            SOLD OUT
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="flex flex-col flex-grow">
                      <div className="text-center flex-grow">
                        <p className="text-xs text-app-green-600 font-medium mb-1">
                          {product.category}
                        </p>
                        <Link href={`/product/${createProductSlug(product.name)}`}>
                          <h3 className="font-semibold text-sm text-foreground mb-2 hover:text-app-green-600 transition-colors duration-200 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-base font-bold text-app-green-600 mb-3">
                          ${product.pricing?.[0]?.price || '25.50'}
                        </p>
                      </div>
                      
                      <div className="flex gap-1.5 mt-auto">
                        <Button 
                          onClick={() => onProductClick(product)}
                          className="flex-1 secondary-button text-xs h-8" 
                          size="sm"
                          variant="secondary"
                        >
                          Quick View
                        </Button>
                        <a 
                          href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}
                          className="flex-1"
                        >
                          <Button 
                            className="w-full primary-button text-xs h-8" 
                            size="sm"
                            disabled={product.soldOut}
                          >
                            <MessageSquare className="mr-1 h-3 w-3" />
                            Order
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card className="text-center p-8 card-glass animate-fade-in">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-app-green-100 to-app-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                    <Search className="h-8 w-8 text-app-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your search or browse a different category
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery("")
                      setActiveCategory("All")
                    }}
                    className="primary-button"
                  >
                    View All Products
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact to Order CTA */}
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
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="sticky top-24 space-y-10">
                {/* Search Bar */}
                <div className="relative animate-fade-in">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input pl-12 h-12 text-base shadow-lg"
                  />
                </div>

                {/* Categories Swiper */}
                <div className="animate-slide-up mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-8">Categories</h2>
                  <Swiper
                    slidesPerView="auto"
                    spaceBetween={12}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="category-swiper-desktop"
                  >
                    {categories.map((category, index) => {
                      const Icon = category.icon
                      const isActive = activeCategory === category.name
                      return (
                        <SwiperSlide key={category.name} className="!w-auto">
                          <Button
                            onClick={() => setActiveCategory(category.name)}
                            className={cn(
                              "flex items-center justify-center px-6 h-12 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 floating-effect gpu-accelerated animate-scale-in shadow-lg backdrop-blur-lg border border-white/20",
                              isActive ? "scale-105" : ""
                            )}
                            style={{ 
                              background: isActive 
                                ? 'linear-gradient(135deg, #225031 0%, #1A3E26 100%)' 
                                : 'linear-gradient(135deg, #2B5D3F 0%, #225031 100%)',
                              animationDelay: `${index * 100}ms`
                            }}
                          >
                            {Icon && <Icon className="mr-2 h-5 w-5" />}
                            {!Icon && <span className="mr-2 text-lg font-bold">All</span>}
                            <span>{category.name}</span>
                          </Button>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>

                {/* Contact CTA */}
                <Card className="glass-card border-app-green-200 animate-fade-in">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-app-green-800 mb-2">Ready to Order?</h3>
                    <p className="text-sm text-app-green-700 mb-4">
                      Text or call us to complete your order
                    </p>
                    <div className="space-y-2">
                      <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
                        <Button className="w-full primary-button">
                          Text to Order
                        </Button>
                      </a>
                      <a href="tel:+16129301390">
                        <Button variant="outline" className="w-full secondary-button">
                          Call (612) 930-1390
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">


              {/* Products Header */}
              <div className="flex items-center justify-between mb-6 animate-slide-up">
                <h2 className="text-2xl font-semibold text-foreground">
                  {searchQuery ? `Search Results` : activeCategory === "All" ? "All Products" : activeCategory}
                </h2>
                <span className="text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <Card 
                    key={product.id} 
                    className="product-card animate-slide-up h-full" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4 h-full flex flex-col">
                      <Link href={`/product/${createProductSlug(product.name)}`}>
                        <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-white shadow-md">
                          <Image
                            src={product.imageUrl}
                            alt={product.imageAlt || product.name}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-110"
                            sizes="(max-width: 1024px) 33vw, 25vw"
                          />
                          {product.soldOut && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                              SOLD OUT
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      <div className="flex flex-col flex-grow">
                        <div className="text-center flex-grow">
                          <p className="text-sm text-app-green-600 font-medium mb-2">
                            {product.category}
                          </p>
                          <Link href={`/product/${createProductSlug(product.name)}`}>
                            <h3 className="font-semibold text-base text-foreground mb-3 hover:text-app-green-600 transition-colors duration-200 line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xl font-bold text-app-green-600 mb-4">
                            ${product.pricing?.[0]?.price || '25.50'}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <Button 
                            onClick={() => onProductClick(product)}
                            className="secondary-button text-sm h-10" 
                            size="sm"
                            variant="secondary"
                          >
                            Quick View
                          </Button>
                          <a 
                            href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}
                          >
                            <Button 
                              className="w-full primary-button text-sm h-10" 
                              size="sm"
                              disabled={product.soldOut}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Order
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <Card className="text-center p-12 card-glass animate-fade-in">
                  <CardContent className="p-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-app-green-100 to-app-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
                      <Search className="h-10 w-10 text-app-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-4">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or browse a different category
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchQuery("")
                        setActiveCategory("All")
                      }}
                      className="primary-button"
                    >
                      View All Products
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
