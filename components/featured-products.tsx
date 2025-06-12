"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import type { Product } from "@/lib/products"

interface FeaturedProductsProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function FeaturedProducts({ products, onProductClick }: FeaturedProductsProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      className="!pb-12"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <Card
            className="overflow-hidden cursor-pointer group transform transition-transform duration-300 hover:scale-105 bg-white/30 dark:bg-black/30 border-none"
            onClick={() => onProductClick(product)}
          >
            <CardContent className="p-0">
              <div className="relative h-56 w-full">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:opacity-90 transition-opacity"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">{product.category}</p>
              </div>
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
