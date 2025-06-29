'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DankIcon } from '@/lib/icons'
import { useToast } from '@/hooks/use-toast'
import { Loader } from '@googlemaps/js-api-loader'
import { cellToLatLng, latLngToCell, cellToBoundary } from 'h3-js'
import { cn } from '@/lib/utils'

interface OrderStatus {
  orderId: string
  status: 'preparing' | 'on_the_way' | 'nearby' | 'delivered'
  driverName: string
  driverPhone: string
  estimatedArrival: string
  driverLocation?: {
    lat: number
    lng: number
    h3Index: string
  }
  customerLocation: {
    lat: number
    lng: number
    h3Index: string
  }
  route?: google.maps.LatLng[]
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { toast } = useToast()
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Initialize map
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'geometry']
    })

    loader.load().then(() => {
      if (!mapRef.current) return

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 44.9778, lng: -93.2650 }, // Minneapolis
        zoom: 13,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#1a1a1a' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#10b981' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#000000' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#2a2a2a' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0e4429' }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      })

      setMap(mapInstance)
    })
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!orderId) return

    // Initial fetch
    fetchOrderStatus()

    // Setup SSE for real-time updates
    const eventSource = new EventSource(`/api/delivery-status?orderId=${orderId}`)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as OrderStatus
      setOrderStatus(data)
      updateMapWithLocation(data)
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      toast({
        title: 'Connection lost',
        description: 'Trying to reconnect...',
        variant: 'destructive',
      })
    }

    return () => {
      eventSource.close()
    }
  }, [orderId])

  // Fetch initial order status
  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`)
      if (!response.ok) throw new Error('Failed to fetch order status')
      
      const data = await response.json()
      setOrderStatus(data)
      updateMapWithLocation(data)
    } catch (error) {
      toast({
        title: 'Error loading order',
        description: 'Please check your order number and try again.',
        variant: 'destructive',
      })
    }
  }

  // Update map with driver location
  const updateMapWithLocation = (status: OrderStatus) => {
    if (!map || !status.driverLocation) return

    const driverPos = new google.maps.LatLng(
      status.driverLocation.lat,
      status.driverLocation.lng
    )
    const customerPos = new google.maps.LatLng(
      status.customerLocation.lat,
      status.customerLocation.lng
    )

    // Update or create driver marker
    if (driverMarker) {
      driverMarker.setPosition(driverPos)
    } else {
      const marker = new google.maps.Marker({
        position: driverPos,
        map,
        title: 'Driver',
        icon: {
          url: '/icons/delivery-driver.svg',
          scaledSize: new google.maps.Size(40, 40),
        },
        animation: google.maps.Animation.DROP,
      })
      setDriverMarker(marker)
    }

    // Draw H3 hexagons for driver vicinity
    drawH3Hexagon(status.driverLocation.h3Index, '#10b981', 0.3)

    // Customer marker
    new google.maps.Marker({
      position: customerPos,
      map,
      title: 'Delivery Address',
      icon: {
        url: '/icons/home-marker.svg',
        scaledSize: new google.maps.Size(40, 40),
      },
    })

    // Draw route
    if (status.route) {
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        polylineOptions: {
          strokeColor: '#10b981',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
        suppressMarkers: true,
      })

      const directionsService = new google.maps.DirectionsService()
      directionsService.route({
        origin: driverPos,
        destination: customerPos,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result)
        }
      })
    }

    // Center map to show both markers
    const bounds = new google.maps.LatLngBounds()
    bounds.extend(driverPos)
    bounds.extend(customerPos)
    map.fitBounds(bounds, 100)
  }

  // Draw H3 hexagon on map
  const drawH3Hexagon = (h3Index: string, color: string, opacity: number) => {
    if (!map) return

    const hexBoundary = cellToBoundary(h3Index)
    const paths = hexBoundary.map(([lat, lng]: [number, number]) => ({ lat, lng }))

    new google.maps.Polygon({
      paths,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: opacity,
      map,
    })
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500'
      case 'on_the_way': return 'bg-blue-500'
      case 'nearby': return 'bg-green-500'
      case 'delivered': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return 'clock'
      case 'on_the_way': return 'delivery'
      case 'nearby': return 'location'
      case 'delivered': return 'check'
      default: return 'info'
    }
  }

  // Format time
  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (!orderStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <DankIcon name="cannabis" size={48} className="mx-auto mb-4 animate-pulse" />
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-[50vh] md:h-[60vh]" />

      {/* Order details */}
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Status card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DankIcon name={getStatusIcon(orderStatus.status) as any} size={24} />
                Order #{orderStatus.orderId}
              </CardTitle>
              <Badge className={getStatusColor(orderStatus.status)}>
                {orderStatus.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <CardDescription>
              Estimated arrival: {formatTime(orderStatus.estimatedArrival)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-6">
                {['preparing', 'on_the_way', 'nearby', 'delivered'].map((step, index) => {
                  const isPast = ['preparing', 'on_the_way', 'nearby', 'delivered'].indexOf(orderStatus.status) >= index
                  const isCurrent = orderStatus.status === step
                  
                  return (
                    <div key={step} className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center bg-background z-10",
                        isPast ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                      )}>
                        {isPast ? (
                          <DankIcon name="check" size={16} />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium",
                          isCurrent && "text-primary"
                        )}>
                          {step === 'preparing' && 'Order being prepared'}
                          {step === 'on_the_way' && 'Driver on the way'}
                          {step === 'nearby' && 'Driver nearby'}
                          {step === 'delivered' && 'Order delivered'}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-muted-foreground">
                            {step === 'preparing' && 'Your order is being carefully packed'}
                            {step === 'on_the_way' && `${orderStatus.driverName} is heading your way`}
                            {step === 'nearby' && 'Your driver is almost there!'}
                            {step === 'delivered' && 'Enjoy your order!'}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver info */}
        {orderStatus.status !== 'preparing' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Driver</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DankIcon name="user" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{orderStatus.driverName}</p>
                    <p className="text-sm text-muted-foreground">Professional delivery partner</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${orderStatus.driverPhone}`}>
                      <DankIcon name="phone" size={16} className="mr-2" />
                      Call
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <DankIcon name="email" size={16} className="mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1">
            <DankIcon name="help" size={16} className="mr-2" />
            Get Help
          </Button>
          <Button variant="outline" className="flex-1">
            <DankIcon name="share" size={16} className="mr-2" />
            Share Tracking
          </Button>
        </div>
      </div>
    </div>
  )
} 