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

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic-card sm:max-w-4xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-2">
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
            </div>
            <div className="mt-6 bg-green-100 dark:bg-green-900/50 p-4 rounded-lg text-center">
              <p className="font-semibold text-green-800 dark:text-green-200">Interested in this gift?</p>
              <p className="text-sm text-green-700 dark:text-green-300">Contact us for donation inquiries.</p>
              <a href="sms:+16129301390?&body=Hi! I'm interested in the ${encodeURIComponent(product.name)} gift.">
                <Button className="w-full mt-3 neumorphic-outset dark:neumorphic-outset-dark">
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
