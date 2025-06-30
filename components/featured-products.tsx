"use client"

import { memo, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { products } from "@/lib/products"
import { createProductSlug } from "@/lib/utils"
import dynamic from "next/dynamic"

// Lazy load heavy components
const CyclingImage = dynamic(() => import("@/components/ui/cycling-image"), {
  loading: () => <div className="aspect-square bg-gray-200 animate-pulse rounded-xl" />,
  ssr: false
})

interface ProductCardProps {
  product: typeof products[0]
  index: number
  isMobile?: boolean
  onProductClick?: (product: typeof products[0]) => void
}

const ProductCard = memo(function ProductCard({ product, index, isMobile = false, onProductClick }: ProductCardProps) {
  const gridClass = isMobile ? "p-3" : "p-4"
  const titleClass = isMobile ? "text-sm" : "text-base"
  const priceClass = isMobile ? "text-lg" : "text-xl"
  const buttonClass = isMobile ? "text-xs h-8" : ""

  return (
    <Card className="product-card animate-slide-up h-full" style={{ animationDelay: `${index * 100}ms` }}>
      <CardContent className={`${gridClass} h-full flex flex-col`}>
        <Link 
          href={`/product/${createProductSlug(product.name)}`}
          onClick={(e) => {
            if (onProductClick) {
              e.preventDefault()
              onProductClick(product)
            }
          }}
        >
          <div className="aspect-square relative mb-3 rounded-xl overflow-hidden bg-white shadow-md">
            <Suspense fallback={
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            }>
              {product.images && product.images.length > 1 ? (
                <CyclingImage
                  images={product.images}
                  alt={product.name}
                  priority={index < 2}
                  sizes={isMobile ? "(max-width: 768px) 180px, 250px" : "(max-width: 1024px) 200px, 250px"}
                />
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  priority={index < 2}
                  sizes={isMobile ? "(max-width: 768px) 180px, 250px" : "(max-width: 1024px) 200px, 250px"}
                />
              )}
            </Suspense>
          </div>
        </Link>
        <div className="text-center flex flex-col h-full">
          <p className={`text-app-green-600 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {product.category}
          </p>
          <Link 
            href={`/product/${createProductSlug(product.name)}`}
            onClick={(e) => {
              if (onProductClick) {
                e.preventDefault()
                onProductClick(product)
              }
            }}
          >
            <h3 className={`font-semibold ${titleClass} text-foreground mb-2 hover:text-app-green-600 transition-colors duration-200 line-clamp-2`}>
              {product.name}
            </h3>
          </Link>
          <div className="flex-grow flex flex-col justify-end">
            <p className={`font-bold text-app-green-600 mb-3 ${priceClass}`}>
              ${product.pricing?.[0]?.price || '25.50'}
            </p>
            <a href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}>
              <Button className={`w-full primary-button ${buttonClass}`}>
                Order Now
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

interface FeaturedProductsProps {
  limit?: number
  isMobile?: boolean
  products?: typeof products
  onProductClick?: (product: typeof products[0]) => void
}

export default memo(function FeaturedProducts({ limit = 6, isMobile = false, products: customProducts, onProductClick }: FeaturedProductsProps) {
  const featuredProducts = customProducts ? customProducts.slice(0, limit) : products.slice(0, limit)
  const gridClass = isMobile ? "grid-cols-2 gap-3" : "grid-cols-4 gap-6"

  if (isMobile) {
    return (
      <div className="animate-slide-up">
        <h2 className="text-xl font-semibold text-foreground mb-6">Hot right now</h2>
        <div className={`grid ${gridClass}`}>
          {featuredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              isMobile={true}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-16 animate-slide-up">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-semibold text-foreground">Hot Right Now</h2>
        <Link href="/menu">
          <Button variant="outline" className="secondary-button">
            View All Products
          </Button>
        </Link>
      </div>
      <div className={`grid ${gridClass}`}>
        {featuredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
            isMobile={false}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  )
})
