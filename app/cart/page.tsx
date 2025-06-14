'use client';

import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const formatCartForText = () => {
    if (!cart || !cart.items) return '';
    
    const itemsList = cart.items.map(item => 
      `${item.productName} (Qty: ${item.quantity}) - $${(item.productPrice * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const orderSummary = [
      'Hi! I\'d like to place an order:',
      '',
      itemsList,
      '',
      `Subtotal: $${cart.subtotal.toFixed(2)}`,
      `Estimated Tax: $${cart.estimatedTax.toFixed(2)}`,
      `Delivery Fee: $${cart.deliveryFee.toFixed(2)}`,
      `Total: $${cart.total.toFixed(2)}`,
      '',
      'Please let me know the next steps for delivery. Thank you!'
    ].join('\n');
    
    return orderSummary;
  };

  const handleTextOrder = () => {
    const message = formatCartForText();
    const encodedMessage = encodeURIComponent(message);
    window.open(`sms:+16129301390?&body=${encodedMessage}`, '_self');
  };

  const handleCallOrder = () => {
    window.open('tel:+16129301390', '_self');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-20 w-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Please sign in to view your cart</h2>
            <Link href="/handler/sign-in?after=/cart">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/menu" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Link>
          <h1 className="text-3xl font-bold mt-2">Your Cart</h1>
        </div>
        
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started!</p>
            <Link href="/menu">
              <Button>
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/menu" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold mt-2">Your Cart</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart Items ({cart.itemCount})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <Image
                      src="/placeholder-product.jpg"
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.productPrice.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.productPrice * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-destructive hover:text-destructive mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span>${cart.estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${cart.deliveryFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="w-full space-y-2">
                <p className="text-sm text-center text-muted-foreground mb-3">
                  Ready to complete your order? Contact us to finalize your purchase:
                </p>
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  size="lg" 
                  onClick={handleTextOrder}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Text Your Order
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCallOrder}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call to Order
                </Button>
              </div>
              
              <div className="text-center text-xs text-muted-foreground">
                <p>📞 (612) 930-1390</p>
                <p className="mt-1">We'll confirm your order and arrange delivery!</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 