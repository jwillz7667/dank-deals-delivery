'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { DankIcon } from '@/lib/icons'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Loader } from '@googlemaps/js-api-loader'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

// Time slots for delivery
const timeSlots = [
  { id: 'asap', label: 'ASAP (30-45 min)', available: true },
  { id: 'morning', label: '10:00 AM - 12:00 PM', available: true },
  { id: 'afternoon', label: '12:00 PM - 3:00 PM', available: true },
  { id: 'evening', label: '3:00 PM - 6:00 PM', available: true },
  { id: 'night', label: '6:00 PM - 9:00 PM', available: true },
  { id: 'late', label: '9:00 PM - 11:00 PM', available: true },
]

interface CheckoutStep {
  id: string
  title: string
  description: string
  icon: string
  completed: boolean
}

export default function SinglePageCheckout() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [stripe, setStripe] = useState<Stripe | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    // Contact info
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    
    // Delivery address
    address: '',
    apartment: '',
    city: 'Minneapolis',
    state: 'MN',
    zipCode: '',
    deliveryInstructions: '',
    
    // Delivery time
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryTimeSlot: 'asap',
    
    // Payment
    paymentMethod: 'card',
    tip: 5,
  })

  // Checkout steps
  const steps = [
    { id: 'delivery', title: 'Delivery Info', description: 'Address & contact', icon: 'truck', completed: false },
    { id: 'payment', title: 'Payment', description: 'Card or cash', icon: 'credit-card', completed: false },
    { id: 'review', title: 'Review Order', description: 'Confirm details', icon: 'check', completed: false },
  ]

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize Stripe
  useEffect(() => {
    stripePromise.then(setStripe)
  }, [])

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    })

    loader.load().then(() => {
      const input = document.getElementById('address-input') as HTMLInputElement
      if (!input) return

      const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry'],
        types: ['address']
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.address_components) return

        let address = ''
        let city = ''
        let state = ''
        let zipCode = ''

        place.address_components.forEach((component) => {
          const types = component.types
          if (types.includes('street_number')) {
            address = component.long_name + ' '
          }
          if (types.includes('route')) {
            address += component.long_name
          }
          if (types.includes('locality')) {
            city = component.long_name
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name
          }
        })

        setFormData(prev => ({
          ...prev,
          address,
          city,
          state,
          zipCode,
        }))
      })
    })
  }, [])

  // Mark step as complete
  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => [...prev, stepIndex])
  }

  // Validate current step
  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Delivery info
        return !!(formData.email && formData.phone && formData.firstName && formData.lastName && formData.address && formData.city && formData.state && formData.zipCode)
      case 1: // Payment
        return !!(formData.paymentMethod)
      case 2: // Review
        return true
      default:
        return false
    }
  }

  // Process payment
  const processPayment = async () => {
    if (!stripe || !cart) return

    setLoading(true)
    try {
      // Create payment intent
      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: (cart.total + formData.tip) * 100, // Convert to cents
          ...formData,
        })
      })

      const { clientSecret, orderId } = await response.json()

      if (formData.paymentMethod === 'apple_pay' || formData.paymentMethod === 'google_pay') {
        // Process digital wallet payment
        const paymentRequest = stripe.paymentRequest({
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Dank Deals MN',
            amount: (cart.total + formData.tip) * 100,
          },
          requestPayerName: true,
          requestPayerEmail: true,
          requestPayerPhone: true,
        })

        const elements = stripe.elements()
        const prElement = elements.create('paymentRequestButton', {
          paymentRequest,
        })

        paymentRequest.on('paymentmethod', async (ev) => {
          const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: ev.paymentMethod.id,
          })

          if (error) {
            ev.complete('fail')
            throw error
          } else {
            ev.complete('success')
            await completeOrder(orderId)
          }
        })

        prElement.mount('#payment-request-button')
      } else {
        // Regular card payment - redirect to payment page
        router.push(`/checkout/payment?orderId=${orderId}&clientSecret=${clientSecret}`)
      }
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Complete order
  const completeOrder = async (orderId: string) => {
    clearCart()
    router.push(`/order-confirmation/${orderId}`)
  }

  // Calculate order summary
  const subtotal = cart?.total || 0
  const deliveryFee = 0 // Free delivery
  const tax = subtotal * 0.08875 // MN tax rate
  const total = subtotal + deliveryFee + tax + formData.tip

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full",
                  "border-2 transition-colors",
                  completedSteps.includes(index) ? "bg-primary border-primary text-primary-foreground" :
                  index === currentStep ? "border-primary text-primary" :
                  "border-muted-foreground text-muted-foreground"
                )}>
                  {completedSteps.includes(index) ? (
                    <DankIcon name="check" size={20} />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-full h-0.5 mx-2",
                    completedSteps.includes(index) ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DankIcon name={steps[currentStep].icon as any} size={24} />
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Delivery Info Step */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(612) 555-0123"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Delivery Address</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address-input">Street Address</Label>
                        <Input
                          id="address-input"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter your address"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="apartment">Apt/Suite (optional)</Label>
                        <Input
                          id="apartment"
                          value={formData.apartment}
                          onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="deliveryInstructions">Delivery Instructions (optional)</Label>
                        <Input
                          id="deliveryInstructions"
                          value={formData.deliveryInstructions}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                          placeholder="Gate code, building entrance, etc."
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Time */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Delivery Time</h3>
                    <RadioGroup
                      value={formData.deliveryTimeSlot}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryTimeSlot: value }))}
                    >
                      {timeSlots.map((slot) => (
                        <div key={slot.id} className="flex items-center space-x-2 py-2">
                          <RadioGroupItem value={slot.id} id={slot.id} disabled={!slot.available} />
                          <Label
                            htmlFor={slot.id}
                            className={cn(
                              "cursor-pointer",
                              !slot.available && "text-muted-foreground line-through"
                            )}
                          >
                            {slot.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <div className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="cursor-pointer">
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value="apple_pay" id="apple_pay" />
                        <Label htmlFor="apple_pay" className="cursor-pointer">
                          Apple Pay
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value="google_pay" id="google_pay" />
                        <Label htmlFor="google_pay" className="cursor-pointer">
                          Google Pay
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Separator />
                  <div>
                    <Label>Add a tip for your driver</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[0, 5, 10, 15].map((amount) => (
                        <Button
                          key={amount}
                          variant={formData.tip === amount ? "default" : "outline"}
                          onClick={() => setFormData(prev => ({ ...prev, tip: amount }))}
                          className="w-full"
                        >
                          {amount === 0 ? 'No tip' : `$${amount}`}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div id="payment-request-button" className="mt-4">
                    {/* Stripe Payment Request Button will be mounted here */}
                  </div>
                </div>
              )}

              {/* Review Order Step */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Review Your Order</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Contact</p>
                          <p>{formData.firstName} {formData.lastName}</p>
                          <p>{formData.email}</p>
                          <p>{formData.phone}</p>
                        </div>
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p>{formData.address}</p>
                          {formData.apartment && <p>Apt {formData.apartment}</p>}
                          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                        </div>
                      </div>
                      {formData.deliveryInstructions && (
                        <div>
                          <p className="font-medium text-sm">Delivery Instructions</p>
                          <p className="text-sm text-muted-foreground">{formData.deliveryInstructions}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">Payment Method</p>
                        <p className="text-sm text-muted-foreground capitalize">{formData.paymentMethod?.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-center text-muted-foreground">
                      By placing this order, you agree to our Terms of Service and confirm that you are 21+ years old.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (validateStep(currentStep)) {
                  markStepComplete(currentStep)
                  if (currentStep === steps.length - 1) {
                    processPayment()
                  } else {
                    setCurrentStep(prev => prev + 1)
                  }
                } else {
                  toast({
                    title: 'Incomplete information',
                    description: 'Please fill in all required fields.',
                    variant: 'destructive',
                  })
                }
              }}
              disabled={loading}
            >
              {currentStep === steps.length - 1 ? 'Place Order' : 'Continue'}
            </Button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart items */}
              <div className="space-y-2">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.productName}</span>
                    <span>${(Number(item.productPrice) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {formData.tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tip</span>
                    <span>${formData.tip.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="space-y-2">
                <Label htmlFor="promo">Promo Code</Label>
                <div className="flex gap-2">
                  <Input id="promo" placeholder="Enter code" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 