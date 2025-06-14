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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Smartphone, Loader2, Heart } from 'lucide-react';
import Link from 'next/link';

const checkoutSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  houseType: z.string().min(1, 'House type is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  streetName: z.string().min(1, 'Street name is required'),
  aptNumber: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay']),
  tip: z.number().min(0, 'Tip cannot be negative').default(0),
  saveProfile: z.boolean().default(false),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

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
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [customTip, setCustomTip] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'card',
      tip: 0,
      saveProfile: false,
    },
  });

  const paymentMethod = watch('paymentMethod');
  const tip = watch('tip');

  // Suggested tip amounts based on subtotal
  const suggestedTips = cart ? [
    { label: '15%', amount: Math.round(cart.subtotal * 0.15 * 100) / 100 },
    { label: '18%', amount: Math.round(cart.subtotal * 0.18 * 100) / 100 },
    { label: '20%', amount: Math.round(cart.subtotal * 0.20 * 100) / 100 },
    { label: '25%', amount: Math.round(cart.subtotal * 0.25 * 100) / 100 },
  ] : [];

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
          if (profile.preferredPaymentMethod && profile.preferredPaymentMethod !== 'cash') {
            setValue('paymentMethod', profile.preferredPaymentMethod);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, router, setValue]);

  const handleTipSelect = (amount: number) => {
    setValue('tip', amount);
    setCustomTip('');
  };

  const handleCustomTip = (value: string) => {
    setCustomTip(value);
    const numValue = parseFloat(value) || 0;
    setValue('tip', numValue);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.data.message);
        await refreshCart();
        router.push(result.data.redirectUrl);
      } else {
        toast.error(result.error?.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  const finalTotal = cart.total + tip;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold mt-2">Checkout</h1>
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

            {/* Tip Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Add a Tip for Your Driver
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Show your appreciation for great service! Tips help support our delivery drivers.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {suggestedTips.map((tipOption) => (
                    <Button
                      key={tipOption.label}
                      type="button"
                      variant={tip === tipOption.amount ? "default" : "outline"}
                      onClick={() => handleTipSelect(tipOption.amount)}
                      className="h-12"
                    >
                      <div className="text-center">
                        <div className="font-semibold">{tipOption.label}</div>
                        <div className="text-xs">${tipOption.amount.toFixed(2)}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="customTip">Custom Tip Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="customTip"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-8"
                      value={customTip}
                      onChange={(e) => handleCustomTip(e.target.value)}
                    />
                  </div>
                </div>

                {tip > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Thank you for adding a ${tip.toFixed(2)} tip! Your driver will appreciate it.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setValue('paymentMethod', value as any)}
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                    <RadioGroupItem value="apple_pay" id="apple_pay" />
                    <Label htmlFor="apple_pay" className="flex items-center flex-1 cursor-pointer">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Apple Pay
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                    <RadioGroupItem value="google_pay" id="google_pay" />
                    <Label htmlFor="google_pay" className="flex items-center flex-1 cursor-pointer">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Google Pay
                    </Label>
                  </div>
                </RadioGroup>
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
                  {tip > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver Tip</span>
                      <span>${tip.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 