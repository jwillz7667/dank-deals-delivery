import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Phone } from "lucide-react"
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic-card sm:max-w-4xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-2 relative">
            {product.soldOut && (
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                SOLD OUT
              </div>
            )}
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              loop
              className="h-full w-full rounded-lg"
            >
              <SwiperSlide>
                <div className="relative h-96 w-full">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative h-96 w-full">
                  <Image
                    src={product.imageUrl.replace(".jpg", "-2.jpg") || "/placeholder.svg"}
                    alt={`${product.name} alternate view`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="p-8 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</DialogTitle>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{product.category}</p>
              <DialogDescription className="text-base text-gray-700 dark:text-gray-300 mt-4">
                {product.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex-grow">
              <h4 className="font-semibold text-gray-900 dark:text-white">Potential Effects:</h4>
              <p className="text-gray-700 dark:text-gray-300">{product.effects}</p>
              
              {product.category === "Flower" && product.pricing && !product.soldOut && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Select Weight:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {product.pricing.map((option, index) => (
                      <button
                        key={option.weight}
                        onClick={() => setSelectedWeight(index)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all",
                          "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20",
                          selectedWeight === index
                            ? "border-green-600 bg-green-100 dark:bg-green-900/30"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {option.weight}
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${option.price}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-green-100 dark:bg-green-900/50 p-4 rounded-lg text-center">
              {product.soldOut ? (
                <>
                  <p className="font-semibold text-red-800 dark:text-red-200">Currently Sold Out</p>
                  <p className="text-sm text-red-700 dark:text-red-300">Check back soon or contact us for availability.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-green-800 dark:text-green-200">Interested in this gift?</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {product.pricing && selectedWeight !== undefined 
                      ? `Selected: ${product.pricing[selectedWeight].weight} - $${product.pricing[selectedWeight].price}`
                      : "Contact us for donation inquiries."}
                  </p>
                </>
              )}
              <a href={`sms:+16129301390?&body=Hi! I'm interested in the ${encodeURIComponent(product.name)}${product.pricing && selectedWeight !== undefined ? ` (${product.pricing[selectedWeight].weight})` : ''} gift.`}>
                <Button className="w-full mt-3 neumorphic-outset dark:neumorphic-outset-dark" disabled={product.soldOut}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call or Text (612) 930-1390
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
