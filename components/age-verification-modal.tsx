"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ShieldCheck, X } from "lucide-react"
import Image from "next/image"

interface AgeVerificationModalProps {
  isOpen: boolean
  onVerify: () => void
  onDecline: () => void
}

export default function AgeVerificationModal({ isOpen, onVerify, onDecline }: AgeVerificationModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Age Verification Required</h2>
            <p className="text-red-100 text-sm">You must be 21 or older to enter this site</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Logo */}
            <div className="text-center">
              <Image
                src="/DANKDEALSMN.COM-LOGO.png"
                alt="DankDealsMN.com Logo"
                width={200}
                height={45}
                className="mx-auto"
              />
            </div>

            {/* Legal Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Legal Cannabis Sales in Minnesota
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
                    This website contains information about cannabis products. You must be <strong>21 years of age or older</strong> to access this site and purchase cannabis products in Minnesota.
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">By entering, you confirm that:</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>You are <strong>21 years of age or older</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>You are a <strong>Minnesota resident</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>You will provide <strong>valid ID</strong> upon delivery</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>You understand cannabis remains <strong>federally illegal</strong></span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onVerify}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Yes, I am 21+ and a Minnesota Resident
              </Button>
              
              <Button 
                onClick={onDecline}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 py-3 rounded-lg transition-all duration-200"
              >
                No, I am under 21
              </Button>
            </div>

            {/* Legal Disclaimer */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-2">
              <p>
                Cannabis products have not been evaluated by the FDA. Keep out of reach of children and pets.
              </p>
              <p>
                For use only by adults 21 years of age or older. Do not drive or operate machinery after use.
              </p>
              <p className="font-medium">
                Licensed Cannabis Delivery Service • Minnesota Cannabis Control Board
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 