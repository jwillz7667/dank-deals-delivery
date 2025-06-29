import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { dateOfBirth } = await request.json()

    if (!dateOfBirth) {
      return NextResponse.json(
        { error: 'Date of birth is required' },
        { status: 400 }
      )
    }

    // Calculate age
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 21) {
      return NextResponse.json(
        { error: 'You must be 21 or older to place an order' },
        { status: 403 }
      )
    }

    // Create Stripe Identity verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        date_of_birth: dateOfBirth,
      },
      options: {
        document: {
          require_matching_selfie: true,
          allowed_types: ['driving_license', 'passport', 'id_card'],
        },
      },
    })

    return NextResponse.json({
      clientSecret: verificationSession.client_secret,
      sessionId: verificationSession.id,
    })
  } catch (error) {
    console.error('Identity verification error:', error)
    return NextResponse.json(
      { error: 'Failed to create verification session' },
      { status: 500 }
    )
  }
}

// Webhook to handle verification completion
export async function PUT(request: NextRequest) {
  try {
    const sig = request.headers.get('stripe-signature')
    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const body = await request.text()
    const webhookSecret = process.env.STRIPE_IDENTITY_WEBHOOK_SECRET || ''

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'identity.verification_session.verified':
        const verificationSession = event.data.object as Stripe.Identity.VerificationSession
        
        // Store verification status in database or session
        // In production, you'd save this to your user's profile
        console.log('User verified:', verificationSession.id)
        
        break
        
      case 'identity.verification_session.requires_input':
        // Handle cases where additional input is needed
        console.log('Verification requires input:', event.data.object)
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