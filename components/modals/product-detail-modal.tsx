import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedWeight, setSelectedWeight] = useState(0)
  
  if (!product) return null

  // Use images array if available, otherwise fallback to single image
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic-card max-w-[95vw] sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-2 relative">
            {product.soldOut && (
              <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm sm:text-base shadow-lg">
                SOLD OUT
              </div>
            )}
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              loop={productImages.length > 1}
              className="h-full w-full rounded-lg"
            >
              {productImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-64 sm:h-80 md:h-96 w-full">
                    <Image
                      src={image}
                      alt={product.imageAlt || `${product.name} - View ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="p-4 sm:p-6 md:p-8 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{product.name}</DialogTitle>
              <p className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">{product.category}</p>
              <DialogDescription className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2 sm:mt-4">
                {product.metaDescription || product.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 sm:mt-6 flex-grow">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Potential Effects:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{product.effects}</p>
              
              {product.category === "Flower" && product.pricing && !product.soldOut && (
                <div className="mt-4 sm:mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">Select Weight:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                    {product.pricing.map((option, index) => (
                      <button
                        key={option.weight}
                        onClick={() => setSelectedWeight(index)}
                        className={cn(
                          "p-2 sm:p-3 rounded-lg border-2 transition-all",
                          "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20",
                          selectedWeight === index
                            ? "border-green-600 bg-green-100 dark:bg-green-900/30"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      >
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {option.weight}
                        </div>
                        <div className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                          ${option.price}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 sm:mt-6 bg-green-100 dark:bg-green-900/50 p-3 sm:p-4 rounded-lg text-center">
              {product.soldOut ? (
                <>
                  <p className="font-semibold text-red-800 dark:text-red-200 text-sm sm:text-base">Currently Sold Out</p>
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">Check back soon or contact us for availability.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-base">Ready to order?</p>
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                    {product.pricing && selectedWeight !== undefined 
                      ? `Selected: ${product.pricing[selectedWeight].weight} - $${product.pricing[selectedWeight].price}`
                      : "Click below to place your order via text."}
                  </p>
                </>
              )}
              <a href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}${product.pricing && selectedWeight !== undefined ? ` (${product.pricing[selectedWeight].weight})` : ''}.`}>
                <Button 
                  className="w-full mt-2 sm:mt-3 neumorphic-outset dark:neumorphic-outset-dark text-sm sm:text-base" 
                  size="lg"
                  disabled={product.soldOut}
                >
                  <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Order Now via Text
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
