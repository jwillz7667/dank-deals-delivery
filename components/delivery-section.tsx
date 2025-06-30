"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default memo(function DeliverySection() {
  return (
    <div className="mb-16 animate-slide-up max-w-7xl mx-auto px-4">
      <Card className="bg-gradient-to-r from-app-green-600/10 to-app-green-800/10 border-app-green-300/50">
        <CardContent className="p-8">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-8">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-app-green-600 to-app-green-700 rounded-2xl flex items-center justify-center mr-4 animate-float">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 8V7c0-1.1-.9-2-2-2H2v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5h-3l-1-6zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Fast Delivery Available!</h2>
                  <p className="text-lg text-app-green-600 font-semibold">Weed delivery anywhere in the Twin Cities & suburbs in 1 hour or less!</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                We deliver to over 20 cities across the Minneapolis-St. Paul metro area. Professional, discreet, and fast service with 21+ verification.
              </p>
              <div className="flex gap-4">
                <Link href="/delivery">
                  <Button className="primary-button px-8 py-3 text-lg">
                    View All Delivery Areas
                  </Button>
                </Link>
                <a href="sms:+16129301390?&body=Hi! I'd like to place a delivery order.">
                  <Button variant="outline" className="secondary-button px-8 py-3 text-lg">
                    Order for Delivery
                  </Button>
                </a>
              </div>
            </div>
            <div className="col-span-4">
              <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                <h3 className="text-xl font-semibold text-foreground mb-4">Service Areas Include:</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Minneapolis & St. Paul</p>
                  <p>• Bloomington & Edina</p>
                  <p>• Plymouth & Minnetonka</p>
                  <p>• Maple Grove & Eden Prairie</p>
                  <p className="text-app-green-600 font-medium">+ 15 more cities</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}) 