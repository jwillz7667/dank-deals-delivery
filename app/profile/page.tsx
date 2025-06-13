'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  User, 
  MapPin, 
  Phone, 
  CreditCard, 
  Package, 
  Clock, 
  Loader2,
  Edit,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  deliveryAddress: z.string().min(10, 'Delivery address is too short').optional().or(z.literal('')),
  deliveryInstructions: z.string().optional(),
  preferredPaymentMethod: z.enum(['cash', 'card', 'apple_pay', 'google_pay']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  itemCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, email, displayName, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPagination, setOrdersPagination] = useState({
    total: 0,
    hasMore: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/handler/sign-in?after=/profile');
    }
  }, [isAuthenticated, router]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (data.success && data.data.profile) {
          const profile = data.data.profile;
          reset({
            phoneNumber: profile.phoneNumber || '',
            deliveryAddress: profile.deliveryAddress || '',
            deliveryInstructions: profile.deliveryInstructions || '',
            preferredPaymentMethod: profile.preferredPaymentMethod || 'cash',
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, reset]);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders?limit=5');
        const data = await response.json();

        if (data.success) {
          // Transform orders to include item count
          const ordersWithCount = data.data.orders.map((order: any) => ({
            ...order,
            itemCount: order.items.length,
          }));
          setOrders(ordersWithCount);
          setOrdersPagination(data.data.pagination);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setOrdersLoading(false);
      }
    };

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        reset(data);
      } else {
        toast.error(result.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!isAuthenticated) {
    return null;
  }

  const statusColors: Record<string, string> = {
    pending: 'secondary',
    confirmed: 'secondary',
    preparing: 'secondary',
    out_for_delivery: 'secondary',
    delivered: 'default',
    cancelled: 'destructive',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and view order history</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your basic account details from Stack Auth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Display Name</Label>
                  <p className="font-medium">{displayName || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </CardFooter>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>Default delivery details for your orders</CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </>
                ) : isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+1234567890"
                        {...register('phoneNumber')}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="deliveryAddress">Delivery Address</Label>
                      <Textarea
                        id="deliveryAddress"
                        placeholder="123 Main St, Apt 4B, City, State 12345"
                        rows={3}
                        {...register('deliveryAddress')}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-sm text-destructive mt-1">{errors.deliveryAddress.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                      <Textarea
                        id="deliveryInstructions"
                        placeholder="Gate code, special instructions, etc."
                        rows={2}
                        {...register('deliveryInstructions')}
                      />
                    </div>

                    <div>
                      <Label>Preferred Payment Method</Label>
                                           <RadioGroup
                       defaultValue={watch('preferredPaymentMethod') || 'cash'}
                       onValueChange={(value: string) => setValue('preferredPaymentMethod', value as any)}
                     >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash">Cash on Delivery</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Credit/Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="apple_pay" id="apple_pay" />
                          <Label htmlFor="apple_pay">Apple Pay</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="google_pay" id="google_pay" />
                          <Label htmlFor="google_pay">Google Pay</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                                               <p className="text-sm text-muted-foreground">
                         {watch('phoneNumber') || 'Not set'}
                       </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                                               <p className="text-sm text-muted-foreground">
                         {watch('deliveryAddress') || 'Not set'}
                       </p>
                       {watch('deliveryInstructions') && (
                         <p className="text-sm text-muted-foreground mt-1">
                           Instructions: {watch('deliveryInstructions')}
                         </p>
                       )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Preferred Payment Method</p>
                                               <p className="text-sm text-muted-foreground">
                         {watch('preferredPaymentMethod')?.replace(/_/g, ' ').toUpperCase() || 'Not set'}
                       </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {isEditing && (
                <CardFooter className="flex gap-2">
                  <Button type="submit" disabled={!isDirty}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </CardFooter>
              )}
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your order history and current orders</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link href="/menu">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/order-confirmation/${order.orderNumber}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{order.orderNumber}</p>
                            <Badge variant={statusColors[order.status] as any}>
                              {order.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span>{order.itemCount} items</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${parseFloat(order.total).toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
            {orders.length > 0 && ordersPagination.hasMore && (
              <CardFooter>
                <Link href="/orders" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 