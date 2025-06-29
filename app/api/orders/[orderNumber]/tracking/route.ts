import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, orderItems, products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { geoToH3 } from 'h3-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const orderNumber = params.orderNumber

    // Fetch order details
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Fetch order items
    const items = await db
      .select({
        orderItem: orderItems,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id))

    // Minneapolis coordinates
    const minneapolisLat = 44.9778
    const minneapolisLng = -93.2650

    // Customer location from order
    const customerLat = minneapolisLat + 0.02
    const customerLng = minneapolisLng - 0.02

    // Driver location (simulated based on order status)
    let driverLat = minneapolisLat
    let driverLng = minneapolisLng
    let driverName = 'Preparing your order...'
    let driverPhone = ''
    
    if (order.status === 'preparing') {
      // Driver at store
      driverLat = minneapolisLat
      driverLng = minneapolisLng
    } else if (order.status === 'out_for_delivery') {
      // Driver en route (halfway)
      driverLat = (minneapolisLat + customerLat) / 2
      driverLng = (minneapolisLng + customerLng) / 2
      driverName = 'John Driver'
      driverPhone = '+1 (612) 555-0123'
    } else if (order.status === 'delivered') {
      // Driver at customer location
      driverLat = customerLat
      driverLng = customerLng
      driverName = 'John Driver'
      driverPhone = '+1 (612) 555-0123'
    }

    // Estimate arrival time based on status
    const now = new Date()
    let estimatedArrival = new Date(now.getTime() + 45 * 60 * 1000) // 45 mins
    
    if (order.status === 'out_for_delivery') {
      estimatedArrival = new Date(now.getTime() + 20 * 60 * 1000) // 20 mins
    } else if (order.status === 'delivered') {
      estimatedArrival = new Date(order.updatedAt)
    }

    // Map order status to tracking status
    const statusMap: Record<string, string> = {
      'pending': 'preparing',
      'confirmed': 'preparing',
      'preparing': 'preparing',
      'out_for_delivery': 'on_the_way',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
    }

    const trackingStatus = statusMap[order.status] || 'preparing'

    // Build response
    const response = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: trackingStatus,
      driverName,
      driverPhone,
      estimatedArrival: estimatedArrival.toISOString(),
      customerLocation: {
        lat: customerLat,
        lng: customerLng,
        h3Index: geoToH3(customerLat, customerLng, 9),
      },
      orderDetails: {
        items: items.map(({ orderItem, product }) => ({
          name: product.name,
          quantity: orderItem.quantity,
          price: parseFloat(orderItem.productPrice),
        })),
        subtotal: parseFloat(order.subtotal),
        tax: parseFloat(order.tax),
        deliveryFee: parseFloat(order.deliveryFee),
        tip: parseFloat(order.tip),
        total: parseFloat(order.total),
      },
    }

    // Only include driver location if out for delivery
    if (order.status === 'out_for_delivery' || order.status === 'delivered') {
      (response as any).driverLocation = {
        lat: driverLat,
        lng: driverLng,
        h3Index: geoToH3(driverLat, driverLng, 9),
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching order tracking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    )
  }
} 