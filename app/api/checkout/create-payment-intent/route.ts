import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { orders, orderItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      email,
      phone,
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      zipCode,
      deliveryInstructions,
      deliveryDate,
      deliveryTimeSlot,
      tip,
      cartItems,
    } = body

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400 }
      )
    }

    // Generate order ID
    const orderId = nanoid(10).toUpperCase()
    const orderNumber = `DD-${Date.now()}-${orderId}`

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      phone,
      name: `${firstName} ${lastName}`,
      address: {
        line1: address,
        line2: apartment || undefined,
        city,
        state,
        postal_code: zipCode,
        country: 'US',
      },
    })

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customer.id,
      metadata: {
        order_id: orderId,
        order_number: orderNumber,
        delivery_date: deliveryDate,
        delivery_time_slot: deliveryTimeSlot,
        tip_amount: tip.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Enable payment method types
      payment_method_types: ['card'],
    })

    // Create order in database
    let orderDbId: number;
    try {
      const orderResult = await db.insert(orders).values({
        orderNumber,
        userId: 'guest', // Guest checkout - using string since schema expects text not null
        status: 'pending',
        subtotal: (amount - tip).toString(),
        tax: '0',
        deliveryFee: '0',
        tip: tip.toString(),
        total: amount.toString(),
        deliveryHouseNumber: address.match(/^\d+/)?.[0] || null,
        deliveryStreetName: address.replace(/^\d+\s*/, '') || address,
        deliveryAptNumber: apartment || null,
        deliveryCity: city,
        deliveryState: state,
        deliveryZipCode: zipCode,
        deliveryInstructions: deliveryInstructions || null,
        paymentMethod: 'stripe',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning({ id: orders.id });
      
      orderDbId = orderResult[0].id;

      // Add order items
      if (cartItems && cartItems.length > 0) {
        const itemsToInsert = cartItems.map((item: any) => ({
          orderId: orderDbId, // Use the actual database ID
          productId: item.productId,
          productName: item.name,
          productPrice: item.price.toString(),
          quantity: item.quantity,
          createdAt: new Date(),
        }))
        
        await db.insert(orderItems).values(itemsToInsert)
      }
    } catch (dbError) {
      // Cancel payment intent if order creation fails
      await stripe.paymentIntents.cancel(paymentIntent.id)
      throw dbError
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
      orderNumber,
      customerId: customer.id,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Webhook to handle payment confirmation
export async function PUT(request: NextRequest) {
  try {
    const sig = request.headers.get('stripe-signature')
    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const body = await request.text()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status
        await db.update(orders)
          .set({
            status: 'confirmed',
            updatedAt: new Date(),
          })
          .where(eq(orders.orderNumber, paymentIntent.metadata.order_number))
        
        // Send order confirmation email
        // await sendOrderConfirmationEmail(paymentIntent.metadata.order_id)
        
        console.log('Payment succeeded:', paymentIntent.id)
        break
        
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status to failed - using order_number from metadata since we don't store payment_intent_id
        await db.update(orders)
          .set({
            status: 'payment_failed',
            updatedAt: new Date(),
          })
          .where(eq(orders.orderNumber, failedIntent.metadata.order_number))
        
        console.log('Payment failed:', failedIntent.id)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
} 