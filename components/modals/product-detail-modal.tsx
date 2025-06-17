"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, MessageSquare, Phone, Plus, Minus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/products"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const { addItem } = useCart()

  if (!product) return null

  // Set default size if not selected
  const defaultSize = product.pricing?.[0]?.size || "1g"
  const currentSize = selectedSize || defaultSize

  const currentPriceValue = product.pricing?.find(p => p.size === currentSize)?.price || 
                           product.pricing?.[0]?.price || 
                           25.50
  const currentPrice = typeof currentPriceValue === 'string' ? parseFloat(currentPriceValue) : currentPriceValue

  const handleAddToCart = () => {
    if (product) {
      addItem(
        product.id.toString(),
        product.name,
        currentPrice,
        quantity
      )
      onClose()
    }
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        {/* Mobile Layout */}
        <div className="lg:hidden h-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Product Image */}
            <div className="relative h-80 bg-white">
              <Image
                src={product.imageUrl}
                alt={product.imageAlt || product.name}
                fill
                className="object-cover"
                priority
              />
              {product.soldOut && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    SOLD OUT
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <Badge variant="outline" className="mb-2 text-app-green-600 border-app-green-600">
                  {product.category}
                </Badge>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-left">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground mt-2">
                  {product.description}
                </p>
              </div>

              {/* Pricing */}
              {product.pricing && product.pricing.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Available Sizes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.pricing.map((pricing) => (
                      <Button
                        key={pricing.size}
                        variant={currentSize === pricing.size ? "default" : "outline"}
                        className={`h-auto p-3 ${
                          currentSize === pricing.size
                            ? "bg-app-green-600 hover:bg-app-green-700"
                            : "border-app-green-200 hover:bg-app-green-50"
                        }`}
                        onClick={() => setSelectedSize(pricing.size)}
                      >
                        <div className="text-center">
                          <div className="font-medium">{pricing.size}</div>
                          <div className="text-sm">${pricing.price}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Strain Info */}
              {(product.strainType || product.thc || product.cbd) && (
                <Card className="bg-app-secondary">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Strain Information</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {product.strainType && (
                        <div>
                          <div className="text-sm text-muted-foreground">Type</div>
                          <div className="font-medium">{product.strainType}</div>
                        </div>
                      )}
                      {product.thc && (
                        <div>
                          <div className="text-sm text-muted-foreground">THC</div>
                          <div className="font-medium">{product.thc}%</div>
                        </div>
                      )}
                      {product.cbd && (
                        <div>
                          <div className="text-sm text-muted-foreground">CBD</div>
                          <div className="font-medium">{product.cbd}%</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span>${(currentPrice * quantity).toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.soldOut}
                  className="w-full bg-app-green-600 hover:bg-app-green-700 text-white h-12"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <a href={`sms:+16129301390?&body=Hi! I'd like to order ${quantity}x ${product.name} (${currentSize}).`}>
                    <Button 
                      variant="outline" 
                      className="w-full border-app-green-600 text-app-green-600 hover:bg-app-green-50"
                      disabled={product.soldOut}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Text Order
                    </Button>
                  </a>
                  <a href="tel:+16129301390">
                    <Button 
                      variant="outline" 
                      className="w-full border-app-green-600 text-app-green-600 hover:bg-app-green-50"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-2 gap-0 h-[600px]">
            {/* Left side - Image */}
            <div className="relative bg-white">
              <Image
                src={product.imageUrl}
                alt={product.imageAlt || product.name}
                fill
                className="object-cover"
                priority
              />
              {product.soldOut && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-xl px-6 py-3">
                    SOLD OUT
                  </Badge>
                </div>
              )}
            </div>

            {/* Right side - Content */}
            <div className="p-8 overflow-y-auto">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <Badge variant="outline" className="mb-3 text-app-green-600 border-app-green-600">
                    {product.category}
                  </Badge>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-left">
                      {product.name}
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-muted-foreground mt-3 text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Pricing */}
                {product.pricing && product.pricing.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">Available Sizes</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {product.pricing.map((pricing) => (
                        <Button
                          key={pricing.size}
                          variant={currentSize === pricing.size ? "default" : "outline"}
                          className={`h-auto p-4 ${
                            currentSize === pricing.size
                              ? "bg-app-green-600 hover:bg-app-green-700"
                              : "border-app-green-200 hover:bg-app-green-50"
                          }`}
                          onClick={() => setSelectedSize(pricing.size)}
                        >
                          <div className="text-center">
                            <div className="font-medium text-base">{pricing.size}</div>
                            <div className="text-sm">${pricing.price}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strain Info */}
                {(product.strainType || product.thc || product.cbd) && (
                  <Card className="bg-app-secondary">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 text-lg">Strain Information</h3>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        {product.strainType && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Type</div>
                            <div className="font-medium text-lg">{product.strainType}</div>
                          </div>
                        )}
                        {product.thc && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">THC</div>
                            <div className="font-medium text-lg">{product.thc}%</div>
                          </div>
                        )}
                        {product.cbd && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">CBD</div>
                            <div className="font-medium text-lg">{product.cbd}%</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quantity Selector */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg">Quantity</h3>
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-12 w-12"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-12 w-12"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total:</span>
                  <span>${(currentPrice * quantity).toFixed(2)}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.soldOut}
                    className="w-full bg-app-green-600 hover:bg-app-green-700 text-white h-14 text-lg"
                  >
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    Add to Cart
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a href={`sms:+16129301390?&body=Hi! I'd like to order ${quantity}x ${product.name} (${currentSize}).`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-app-green-600 text-app-green-600 hover:bg-app-green-50 h-12"
                        disabled={product.soldOut}
                      >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Text Order
                      </Button>
                    </a>
                    <a href="tel:+16129301390">
                      <Button 
                        variant="outline" 
                        className="w-full border-app-green-600 text-app-green-600 hover:bg-app-green-50 h-12"
                      >
                        <Phone className="mr-2 h-5 w-5" />
                        Call
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
