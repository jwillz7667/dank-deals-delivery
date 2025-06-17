'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Home, Clock, MapPin, Phone, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface OrderDetails {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: string;
  tax: string;
  deliveryFee: string;
  tip: string;
  total: string;
  deliveryHouseType?: string;
  deliveryHouseNumber?: string;
  deliveryStreetName?: string;
  deliveryAptNumber?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZipCode?: string;
  deliveryInstructions?: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    id: number;
    productId: string;
    productName: string;
    productPrice: string;
    quantity: number;
  }>;
}

const statusSteps = [
  { status: 'pending_contact', label: 'Awaiting Contact', icon: MessageSquare },
  { status: 'pending', label: 'Order Placed', icon: CheckCircle },
  { status: 'confirmed', label: 'Confirmed', icon: Package },
  { status: 'preparing', label: 'Preparing', icon: Clock },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

const statusColors: Record<string, string> = {
  pending_contact: 'outline',
  pending: 'secondary',
  confirmed: 'secondary',
  preparing: 'secondary',
  out_for_delivery: 'secondary',
  delivered: 'default',
  cancelled: 'destructive',
};

export default function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    params.then(p => setOrderNumber(p.orderNumber));
  }, [params]);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    
    if (!isAuthenticated) {
      router.push('/handler/sign-in?after=/order-confirmation/' + orderNumber);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderNumber}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error?.message || 'Failed to load order');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, orderNumber, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || 'Unable to find this order'}</p>
            <Link href="/menu">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);
  const isTextOrder = order.paymentMethod === 'text_call';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Message */}
      <Card className={`mb-8 ${isTextOrder ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            {isTextOrder ? (
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            )}
            <div>
              <h1 className={`text-2xl font-bold ${isTextOrder ? 'text-blue-900 dark:text-blue-100' : 'text-green-900 dark:text-green-100'}`}>
                {isTextOrder ? 'Order Information Received!' : 'Order Confirmed!'}
              </h1>
              <p className={`${isTextOrder ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}>
                {isTextOrder 
                  ? 'Your order details have been saved. Please contact us to complete your purchase.'
                  : 'Thank you for your order. We\'ll send you updates about your delivery.'
                }
              </p>
              {!isTextOrder && parseFloat(order.tip) > 0 && (
                <p className="text-green-700 dark:text-green-300 mt-2 font-medium">
                  🙏 Thank you for the ${parseFloat(order.tip).toFixed(2)} tip! Your driver will appreciate your generosity.
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <p className={`text-sm ${isTextOrder ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}>
              Order Number: <span className="font-mono font-semibold">{order.orderNumber}</span>
            </p>
            <p className={`text-sm ${isTextOrder ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}>
              Created on: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
          {isTextOrder && (
            <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>1. Contact us at <strong>(612) 930-1390</strong> to complete your order</p>
                <p>2. We'll confirm availability and arrange payment</p>
                <p>3. Schedule your delivery time</p>
              </div>
              <div className="flex gap-2 mt-3">
                <a href={`sms:+16129301390?&body=Hi! I'd like to complete my order %23${order.orderNumber}. Please let me know the next steps. Thank you!`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Text Us
                  </Button>
                </a>
                <a href="tel:+16129301390">
                  <Button size="sm" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </Button>
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Status</CardTitle>
                <Badge variant={statusColors[order.status] as any}>
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-muted" />
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = currentStepIndex >= index;
                    const isCurrent = currentStepIndex === index;

                    return (
                      <div key={step.status} className="flex items-center gap-4">
                        <div
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-muted-foreground">
                              {step.status === 'pending_contact' 
                                ? 'Please contact us to complete your order'
                                : `Your order is currently ${step.label.toLowerCase()}`
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ${parseFloat(item.productPrice).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(parseFloat(item.productPrice) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Delivery Address</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {order.deliveryHouseType && order.deliveryHouseNumber && order.deliveryStreetName ? (
                      <>
                        <p>
                          {order.deliveryHouseNumber} {order.deliveryStreetName}
                          {order.deliveryAptNumber && `, ${order.deliveryAptNumber}`}
                        </p>
                        <p>
                          {order.deliveryCity}, {order.deliveryState} {order.deliveryZipCode}
                        </p>
                        <p className="text-xs text-muted-foreground/80 capitalize">
                          {order.deliveryHouseType}
                        </p>
                      </>
                    ) : (
                      <p>Address information not available</p>
                    )}
                    {order.deliveryInstructions && (
                      <p className="mt-2 pt-2 border-t border-muted">
                        <span className="font-medium">Instructions:</span> {order.deliveryInstructions}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {isTextOrder ? (
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium mb-1">Order Type</p>
                  <p className="text-sm text-muted-foreground">
                    {isTextOrder 
                      ? 'Text/Call to Complete'
                      : order.paymentMethod.replace(/_/g, ' ').toUpperCase()
                    }
                  </p>
                  {isTextOrder && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact us to arrange payment
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${parseFloat(order.deliveryFee).toFixed(2)}</span>
              </div>
              {!isTextOrder && parseFloat(order.tip) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver Tip</span>
                  <span>${parseFloat(order.tip).toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
              {isTextOrder && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  * Final total will be confirmed when you contact us
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Link href="/menu" className="w-full">
                <Button className="w-full">Continue Shopping</Button>
              </Link>
              <Link href="/profile" className="w-full">
                <Button variant="outline" className="w-full">View All Orders</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 