'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Home, Clock, MapPin, Phone, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface OrderDetails {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  deliveryAddress: string;
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
  { status: 'pending', label: 'Order Placed', icon: CheckCircle },
  { status: 'confirmed', label: 'Confirmed', icon: Package },
  { status: 'preparing', label: 'Preparing', icon: Clock },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

const statusColors: Record<string, string> = {
  pending: 'secondary',
  confirmed: 'secondary',
  preparing: 'secondary',
  out_for_delivery: 'secondary',
  delivered: 'default',
  cancelled: 'destructive',
};

export default function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/handler/sign-in?after=/order-confirmation/' + params.orderNumber);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderNumber}`);
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
  }, [isAuthenticated, params.orderNumber, router]);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Message */}
      <Card className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-green-900 dark:text-green-100">
                Order Confirmed!
              </h1>
              <p className="text-green-700 dark:text-green-300">
                Thank you for your order. We'll send you updates about your delivery.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              Order Number: <span className="font-mono font-semibold">{order.orderNumber}</span>
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
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
                              Your order is currently {step.label.toLowerCase()}
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
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                  {order.deliveryInstructions && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Instructions: {order.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Payment Method</p>
                  <p className="text-sm text-muted-foreground">
                    {order.paymentMethod.replace(/_/g, ' ').toUpperCase()}
                  </p>
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
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
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