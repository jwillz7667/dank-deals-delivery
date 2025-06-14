'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';
import { useRequiredAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, MessageSquare, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const orderSummarySchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  houseType: z.string().min(1, 'House type is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  aptNumber: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  deliveryInstructions: z.string().optional(),
  saveProfile: z.boolean().default(false),
});

type OrderSummaryFormData = z.infer<typeof orderSummarySchema>;

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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { isAuthenticated, userId } = useRequiredAuth();
  const [profileLoading, setProfileLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderSummaryFormData>({
    resolver: zodResolver(orderSummarySchema),
    defaultValues: {
      saveProfile: false,
    },
  });

  // Load user profile if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/handler/sign-in?after=/checkout');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (data.success && data.data.profile) {
          const profile = data.data.profile;
          if (profile.phoneNumber) setValue('phoneNumber', profile.phoneNumber);
          if (profile.houseType) setValue('houseType', profile.houseType);
          if (profile.houseNumber) setValue('houseNumber', profile.houseNumber);
          if (profile.streetName) setValue('streetName', profile.streetName);
          if (profile.aptNumber) setValue('aptNumber', profile.aptNumber);
          if (profile.city) setValue('city', profile.city);
          if (profile.state) setValue('state', profile.state);
          if (profile.zipCode) setValue('zipCode', profile.zipCode);
          if (profile.deliveryInstructions) setValue('deliveryInstructions', profile.deliveryInstructions);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, router, setValue]);

  const formatOrderForText = (data: OrderSummaryFormData) => {
    if (!cart || !cart.items) return '';
    
    const itemsList = cart.items.map(item => 
      `${item.productName} (Qty: ${item.quantity}) - $${(item.productPrice * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const deliveryAddress = [
      `${data.houseNumber} ${data.streetName}`,
      data.aptNumber ? `${data.aptNumber}` : '',
      `${data.city}, ${data.state} ${data.zipCode}`
    ].filter(Boolean).join(', ');
    
    const orderSummary = [
      'Hi! I\'d like to place an order:',
      '',
      '📦 ORDER ITEMS:',
      itemsList,
      '',
      '💰 ORDER TOTAL:',
      `Subtotal: $${cart.subtotal.toFixed(2)}`,
      `Estimated Tax: $${cart.estimatedTax.toFixed(2)}`,
      `Delivery Fee: $${cart.deliveryFee.toFixed(2)}`,
      `Total: $${cart.total.toFixed(2)}`,
      '',
      '📍 DELIVERY ADDRESS:',
      deliveryAddress,
      data.deliveryInstructions ? `Instructions: ${data.deliveryInstructions}` : '',
      '',
      `📞 CONTACT: ${data.phoneNumber}`,
      '',
      'Please confirm this order and let me know the next steps for payment and delivery. Thank you!'
    ].filter(Boolean).join('\n');
    
    return orderSummary;
  };

  const handleTextOrder = (data: OrderSummaryFormData) => {
    const message = formatOrderForText(data);
    const encodedMessage = encodeURIComponent(message);
    window.open(`sms:+16129301390?&body=${encodedMessage}`, '_self');
  };

  const handleCallOrder = () => {
    window.open('tel:+16129301390', '_self');
  };

  const onSubmit = async (data: OrderSummaryFormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
      return;
    }

    // Save profile if requested
    if (data.saveProfile) {
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: data.phoneNumber,
            houseType: data.houseType,
            houseNumber: data.houseNumber,
            streetName: data.streetName,
            aptNumber: data.aptNumber,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            deliveryInstructions: data.deliveryInstructions,
          }),
        });
      } catch (error) {
        console.error('Failed to save profile:', error);
      }
    }

    // Send the text message
    handleTextOrder(data);
  };

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Link href="/menu">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold mt-2">Order Summary</h1>
        <p className="text-muted-foreground mt-2">
          Complete your delivery information and we'll help you place your order
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Save Profile */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveProfile"
                    checked={watch('saveProfile')}
                    onCheckedChange={(checked) => setValue('saveProfile', checked as boolean)}
                  />
                  <Label htmlFor="saveProfile" className="cursor-pointer">
                    Save delivery information to my profile for future orders
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>${(item.productPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
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
                    Choose how you'd like to place your order:
                  </p>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    size="lg"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Text Complete Order
                  </Button>
                  
                  <Button 
                    type="button"
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
                  <p className="mt-1">We'll confirm your order and arrange payment & delivery!</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 