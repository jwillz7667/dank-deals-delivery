'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRequiredAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  MapPin, 
  Phone, 
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
  houseType: z.string().min(1, 'House type is required').optional().or(z.literal('')),
  houseNumber: z.string().min(1, 'House number is required').optional().or(z.literal('')),
  streetName: z.string().min(1, 'Street name is required').optional().or(z.literal('')),
  aptNumber: z.string().optional(),
  city: z.string().min(1, 'City is required').optional().or(z.literal('')),
  state: z.string().min(2, 'State is required').optional().or(z.literal('')),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').optional().or(z.literal('')),
  deliveryInstructions: z.string().optional(),
});

const HOUSE_TYPES = [
  'House',
  'Townhouse', 
  'Apartment',
  'Condo',
  'Duplex',
  'Mobile Home',
  'Other'
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, userId } = useRequiredAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Load profile data
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/handler/sign-in?after=/profile');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (data.success && data.data.profile) {
          const profile = data.data.profile;
          setValue('phoneNumber', profile.phoneNumber || '');
          setValue('houseType', profile.houseType || '');
          setValue('houseNumber', profile.houseNumber || '');
          setValue('streetName', profile.streetName || '');
          setValue('aptNumber', profile.aptNumber || '');
          setValue('city', profile.city || '');
          setValue('state', profile.state || '');
          setValue('zipCode', profile.zipCode || '');
          setValue('deliveryInstructions', profile.deliveryInstructions || '');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, router, setValue]);

  // Load orders
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();

        if (data.success) {
          setOrders(data.data.orders || []);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);

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
      } else {
        toast.error(result.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values - you might want to reload from API
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      pending_contact: { variant: 'outline' as const, label: 'Awaiting Contact' },
      confirmed: { variant: 'default' as const, label: 'Confirmed' },
      processing: { variant: 'default' as const, label: 'Processing' },
      out_for_delivery: { variant: 'default' as const, label: 'Out for Delivery' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDeliveryAddress = () => {
    const parts = [
      watch('houseNumber'),
      watch('streetName'),
      watch('aptNumber'),
      watch('city'),
      watch('state'),
      watch('zipCode')
    ].filter(Boolean);
    
    if (parts.length === 0) return 'Not set';
    
    const addressLine1 = [watch('houseNumber'), watch('streetName')].filter(Boolean).join(' ');
    const addressLine2 = watch('aptNumber') ? `${watch('aptNumber')}` : '';
    const cityStateZip = [watch('city'), watch('state'), watch('zipCode')].filter(Boolean).join(', ');
    
    return [addressLine1, addressLine2, cityStateZip].filter(Boolean).join(', ');
  };

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your contact and delivery information
                </CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)}>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="houseType">Property Type</Label>
                        <select
                          id="houseType"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...register('houseType')}
                        >
                          <option value="">Select type</option>
                          {HOUSE_TYPES.map(type => (
                            <option key={type} value={type.toLowerCase()}>{type}</option>
                          ))}
                        </select>
                        {errors.houseType && (
                          <p className="text-sm text-destructive mt-1">{errors.houseType.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="houseNumber">House/Building Number</Label>
                        <Input
                          id="houseNumber"
                          placeholder="123"
                          {...register('houseNumber')}
                        />
                        {errors.houseNumber && (
                          <p className="text-sm text-destructive mt-1">{errors.houseNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="streetName">Street Name</Label>
                      <Input
                        id="streetName"
                        placeholder="Main Street"
                        {...register('streetName')}
                      />
                      {errors.streetName && (
                        <p className="text-sm text-destructive mt-1">{errors.streetName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="aptNumber">Apartment/Unit Number (Optional)</Label>
                      <Input
                        id="aptNumber"
                        placeholder="Apt 4B, Unit 12, etc."
                        {...register('aptNumber')}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Minneapolis"
                          {...register('city')}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="state">State</Label>
                        <select
                          id="state"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...register('state')}
                        >
                          <option value="">State</option>
                          {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="55401"
                          {...register('zipCode')}
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="deliveryInstructions"
                        placeholder="Gate code, buzzer number, special instructions, etc."
                        rows={2}
                        {...register('deliveryInstructions')}
                      />
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
                          {formatDeliveryAddress()}
                        </p>
                        {watch('deliveryInstructions') && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Instructions: {watch('deliveryInstructions')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <CardFooter className="flex gap-3 px-0">
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </CardFooter>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>
                View your past orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link href="/menu">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          {getOrderStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${parseFloat(order.total).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <span>{order.items?.length || 0} items</span>
                      </div>
                      {order.status === 'pending_contact' && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
                          Please contact us at (612) 930-1390 to complete this order.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 