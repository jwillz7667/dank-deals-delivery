import { NextRequest, NextResponse } from 'next/server'
import { latLngToCell } from 'h3-js'

// SSE endpoint for real-time delivery tracking
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
  }

  // Create SSE response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', orderId })}\n\n`)
      )

      // Simulate driver location updates
      let updateCount = 0
      const interval = setInterval(async () => {
        try {
          // In production, fetch real driver location from database
          const driverLocation = await getDriverLocation(orderId, updateCount)
          
          if (driverLocation) {
            const data = JSON.stringify({
              orderId,
              status: driverLocation.status,
              driverName: driverLocation.driverName,
              driverPhone: driverLocation.driverPhone,
              estimatedArrival: driverLocation.estimatedArrival,
              driverLocation: driverLocation.currentLocation,
              customerLocation: driverLocation.customerLocation,
            })
            
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          updateCount++

          // Stop after delivery
          if (driverLocation?.status === 'delivered' || updateCount > 100) {
            clearInterval(interval)
            controller.close()
          }
        } catch (error) {
          console.error('Error sending update:', error)
          clearInterval(interval)
          controller.error(error)
        }
      }, 5000) // Update every 5 seconds

      // Clean up on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    },
  })
}

// Simulate driver location updates
async function getDriverLocation(orderId: string, updateCount: number) {
  // Minneapolis coordinates
  const minneapolisLat = 44.9778
  const minneapolisLng = -93.2650

  // Simulate driver movement
  const statuses = ['preparing', 'on_the_way', 'nearby', 'delivered']
  const statusIndex = Math.min(Math.floor(updateCount / 5), statuses.length - 1)
  const currentStatus = statuses[statusIndex]

  // Calculate driver position based on progress
  const progress = Math.min(updateCount * 0.05, 1) // 0 to 1
  const driverLat = minneapolisLat + (Math.random() - 0.5) * 0.05 * progress
  const driverLng = minneapolisLng + (Math.random() - 0.5) * 0.05 * progress

  // Customer location (fixed)
  const customerLat = minneapolisLat + 0.02
  const customerLng = minneapolisLng - 0.02

  return {
    status: currentStatus,
    driverName: 'John Driver',
    driverPhone: '+1 (612) 555-0123',
    estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins from now
    currentLocation: {
      lat: driverLat,
      lng: driverLng,
      h3Index: latLngToCell(driverLat, driverLng, 9), // Resolution 9 for neighborhood-level
    },
    customerLocation: {
      lat: customerLat,
      lng: customerLng,
      h3Index: latLngToCell(customerLat, customerLng, 9),
    },
  }
} 