"use client"

import { useState } from "react"
import { products, type Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { createProductSlug } from "@/lib/utils"

interface MenuSectionProps {
  onProductClick: (product: Product) => void
}

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

export default function MenuSection({ onProductClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProducts = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory)

  return (
    <section id="menu" className="py-12 sm:py-16 md:py-24 bg-neumorphic-bg dark:bg-neumorphic-bg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">Our Menu</h2>
        <p className="text-base sm:text-lg text-center text-gray-600 dark:text-gray-400 mb-8 sm:mb-12">
          Explore our curated selection. Text to order!
        </p>

        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "neumorphic-outset dark:neumorphic-outset-dark text-sm sm:text-lg px-3 sm:px-6 py-2 sm:py-3",
                activeCategory === category && "neumorphic-inset dark:neumorphic-inset-dark",
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="glassmorphic-card cursor-pointer group overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-0">
                <Link href={`/product/${createProductSlug(product.name)}`}>
                  <div className="relative h-48 sm:h-56 lg:h-64 w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt || product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {product.soldOut && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg font-bold text-xs sm:text-sm shadow-lg">
                        SOLD OUT
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4 sm:p-5 lg:p-6">
                  <Link href={`/product/${createProductSlug(product.name)}`}>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm sm:text-md font-semibold text-green-600 dark:text-green-400 mt-1">{product.category}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  {product.category === "Flower" && product.pricing && !product.soldOut && (
                    <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                      Starting at ${product.pricing[0].price}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button 
                      onClick={() => onProductClick(product)}
                      className="flex-1 neumorphic-outset dark:neumorphic-outset-dark text-xs sm:text-sm" 
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
                        className="w-full neumorphic-outset dark:neumorphic-outset-dark text-xs sm:text-sm" 
                        size="sm"
                        disabled={product.soldOut}
                      >
                        <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                        Order
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
