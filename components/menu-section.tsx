"use client"

import { useState } from "react"
import { products, type Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MenuSectionProps {
  onProductClick: (product: Product) => void
}

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

export default function MenuSection({ onProductClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProducts = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory)

  return (
    <section id="menu" className="py-24 bg-neumorphic-bg dark:bg-neumorphic-bg">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">Our Menu</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          Explore our curated selection. Call or text for gifting inquiries.
        </p>

        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "neumorphic-outset dark:neumorphic-outset-dark text-lg px-6 py-3",
                activeCategory === category && "neumorphic-inset dark:neumorphic-inset-dark",
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => onProductClick(product)}
              className="glassmorphic-card cursor-pointer group overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.soldOut && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                      SOLD OUT
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-md font-semibold text-green-600 dark:text-green-400 mt-1">{product.category}</p>
                  <p className="text-gray-700 dark:text-gray-300 mt-3">{product.description.substring(0, 100)}...</p>
                  {product.category === "Flower" && product.pricing && !product.soldOut && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                      Starting at ${product.pricing[0].price}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
