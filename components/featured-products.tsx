"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import type { Product } from "@/lib/products"
import Link from "next/link"
import { createProductSlug } from "@/lib/utils"

interface FeaturedProductsProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function FeaturedProducts({ products, onProductClick }: FeaturedProductsProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={16}
      slidesPerView={1.2}
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      breakpoints={{
        480: { slidesPerView: 1.5, spaceBetween: 20 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 2.5, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 30 },
      }}
      className="!pb-12"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <Card
            className="overflow-hidden cursor-pointer group transform transition-transform duration-300 hover:scale-105 bg-white/30 dark:bg-black/30 border-none"
          >
            <Link href={`/product/${createProductSlug(product.name)}`}>
              <CardContent className="p-0">
                <div className="relative h-40 sm:h-48 md:h-56 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt || product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:opacity-90 transition-opacity"
                    priority={products.indexOf(product) === 0} // FIXED: Priority load first product
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  {product.soldOut && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg font-bold text-xs shadow-lg">
                      SOLD OUT
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h4>
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium">{product.category}</p>
                  {product.category === "Flower" && product.pricing && !product.soldOut && (
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                      From ${product.pricing[0].price}
                    </p>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
