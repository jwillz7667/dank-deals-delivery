"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Lazy load icons only when needed
const ShieldCheckIcon = dynamic(() => import("lucide-react").then(mod => ({ default: mod.ShieldCheck })), {
  loading: () => <div className="h-12 w-12 bg-red-500/20 rounded-full animate-pulse" />
})

const CalendarIcon = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Calendar })), {
  loading: () => <div className="h-6 w-6 bg-yellow-500/20 rounded animate-pulse" />
})

// Optimized Image component with lazy loading
const OptimizedLogo = dynamic(() => import("next/image").then(mod => ({ 
  default: memo(({ className }: { className?: string }) => (
    <mod.default
      src="/DANKDEALSMN.COM-LOGO.png"
      alt="DankDealsMN.com Logo"
      width={200}
      height={45}
      className={className}
      priority={false}
      loading="lazy"
      sizes="200px"
    />
  ))
})), {
  loading: () => <div className="w-[200px] h-[45px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
})

interface AgeVerificationModalProps {
  isOpen: boolean
  onVerify: () => void
  onDecline: () => void
}

// Memoized component to prevent unnecessary re-renders
const AgeVerificationModal = memo(function AgeVerificationModal({ 
  isOpen, 
  onVerify, 
  onDecline 
}: AgeVerificationModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Optimize animation timing
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // Memoized event handlers to prevent unnecessary re-renders
  const handleVerify = useCallback(() => {
    onVerify()
  }, [onVerify])

  const handleDecline = useCallback(() => {
    onDecline()
  }, [onDecline])

  // Early return for better performance
  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: isVisible ? 'blur(8px)' : 'blur(0px)',
        WebkitBackdropFilter: isVisible ? 'blur(8px)' : 'blur(0px)'
      }}
    >
      <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 shadow-2xl border-0 overflow-hidden transform transition-transform duration-300">
        <CardContent className="p-0">
          {/* Optimized Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheckIcon />
            </div>
            <h2 className="text-2xl font-bold mb-2">Age Verification Required</h2>
            <p className="text-red-100 text-sm">You must be 21 or older to enter this site</p>
          </div>

          {/* Optimized Content */}
          <div className="p-6 space-y-6">
            {/* Lazy loaded Logo */}
            <div className="text-center">
              <OptimizedLogo className="mx-auto" />
            </div>

            {/* Optimized Legal Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CalendarIcon />
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

            {/* Optimized Requirements List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">By entering, you confirm that:</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {[
                  'You are 21 years of age or older',
                  'You are a Minnesota resident', 
                  'You will provide valid ID upon delivery',
                  'You understand cannabis remains federally illegal'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 dark:text-green-400 font-bold select-none">✓</span>
                    <span><strong>{item.includes('21') ? item.replace('21 years of age or older', '21 years of age or older') : item.replace(/\*\*(.*?)\*\*/g, '$1')}</strong></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optimized Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleVerify}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors duration-200"
                type="button"
              >
                Yes, I am 21+ and a Minnesota Resident
              </Button>
              
              <Button 
                onClick={handleDecline}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 py-3 rounded-lg transition-colors duration-200"
                type="button"
              >
                No, I am under 21
              </Button>
            </div>

            {/* Optimized Legal Disclaimer */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-2">
              <p>Cannabis products have not been evaluated by the FDA. Keep out of reach of children and pets.</p>
              <p>For use only by adults 21 years of age or older. Do not drive or operate machinery after use.</p>
              <p className="font-medium">Licensed Cannabis Delivery Service • Minnesota Cannabis Control Board</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

export default AgeVerificationModal 