"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { MessageSquare, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart()

  const formatCartForText = () => {
    if (!cart || !cart.items) return ''
    
    const itemsList = cart.items.map(item => 
      `${item.productName} (Qty: ${item.quantity}) - $${(item.productPrice * item.quantity).toFixed(2)}`
    ).join('\n')
    
    const total = cart.total
    
    return `Hi! I'd like to place an order:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}\n\nPlease let me know the next steps for delivery. Thank you!`
  }

  const handleTextOrder = () => {
    const message = formatCartForText()
    const encodedMessage = encodeURIComponent(message)
    window.open(`sms:+16129301390?&body=${encodedMessage}`, '_self')
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
            <Button onClick={onClose} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ${item.productPrice.toFixed(2)} each
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={loading}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={loading}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  ${(item.productPrice * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                  disabled={loading}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-green-600 dark:text-green-400">
              ${cart.total.toFixed(2)}
            </span>
          </div>

          <div className="bg-green-100 dark:bg-green-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Ready to order? We'll send your cart details via text message to complete your order.
            </p>
            <Button 
              onClick={handleTextOrder}
              className="w-full neumorphic-outset dark:neumorphic-outset-dark" 
              size="lg"
              disabled={loading}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Order via Text Message
            </Button>
          </div>

          <Button 
            onClick={onClose} 
            variant="outline" 
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 