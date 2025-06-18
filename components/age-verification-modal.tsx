"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Critical performance optimization: Load icons with priority and fallbacks
const ShieldCheckIcon = dynamic(() => import("lucide-react").then(mod => ({ default: mod.ShieldCheck })), {
  loading: () => <div className="h-8 w-8 sm:h-12 sm:w-12 bg-red-500/20 rounded-full animate-pulse flex-shrink-0" />,
  ssr: false
})

const CalendarIcon = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Calendar })), {
  loading: () => <div className="h-5 w-5 sm:h-6 sm:w-6 bg-yellow-500/20 rounded animate-pulse flex-shrink-0" />,
  ssr: false
})

// Optimized logo with critical loading and size constraints for mobile
const OptimizedLogo = dynamic(() => import("next/image").then(mod => ({ 
  default: memo(({ className }: { className?: string }) => (
    <mod.default
      src="/DANKDEALSMN.COM-LOGO.png"
      alt="DankDealsMN.com Logo"
      width={160}
      height={36}
      className={className}
      priority={true}
      loading="eager"
      sizes="(max-width: 640px) 140px, 160px"
      style={{ width: 'auto', height: 'auto', maxWidth: '160px' }}
    />
  ))
})), {
  loading: () => <div className="w-[140px] sm:w-[160px] h-[32px] sm:h-[36px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
})

interface AgeVerificationModalProps {
  isOpen: boolean
  onVerify: () => void
  onDecline: () => void
}

// Mobile-optimized modal with Google's best practices
const AgeVerificationModal = memo(function AgeVerificationModal({ 
  isOpen, 
  onVerify, 
  onDecline 
}: AgeVerificationModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Optimized animation with reduced motion support
  useEffect(() => {
    if (isOpen) {
      // Use double RAF for better performance and reduced layout shift
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // Optimized event handlers with error boundaries
  const handleVerify = useCallback(() => {
    try {
      onVerify()
    } catch (error) {
      console.error('Age verification error:', error)
    }
  }, [onVerify])

  const handleDecline = useCallback(() => {
    try {
      onDecline()
    } catch (error) {
      console.error('Age decline error:', error)
      // Fallback redirect
      window.location.href = 'https://www.samhsa.gov/find-help/national-helpline'
    }
  }, [onDecline])

  // Early return for performance
  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: isVisible ? 'blur(12px)' : 'blur(0px)',
        WebkitBackdropFilter: isVisible ? 'blur(12px)' : 'blur(0px)',
        willChange: isVisible ? 'auto' : 'transform'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-verification-title"
    >
      {/* Mobile-optimized modal size */}
      <Card className={`
        w-full max-w-[340px] sm:max-w-md 
        bg-white dark:bg-gray-800 
        shadow-2xl border-0 overflow-hidden 
        transform transition-all duration-300 ease-out
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
        <CardContent className="p-0">
          {/* Compact header for mobile */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <ShieldCheckIcon />
            </div>
            <h2 id="age-verification-title" className="text-lg sm:text-2xl font-bold mb-2">
              Age Verification Required
            </h2>
            <p className="text-red-100 text-xs sm:text-sm">You must be 21 or older to enter this site</p>
          </div>

          {/* Compact content for mobile */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Logo - smaller on mobile */}
            <div className="text-center">
              <OptimizedLogo className="mx-auto" />
            </div>

            {/* Compact legal notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <CalendarIcon />
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1 sm:mb-2">
                    Legal Cannabis Sales in Minnesota
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
                    You must be <strong>21 years of age or older</strong> to access this site and purchase cannabis products in Minnesota.
                  </p>
                </div>
              </div>
            </div>

            {/* Compact requirements list */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">By entering, you confirm:</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {[
                  'You are 21+ years old',
                  'You are a Minnesota resident', 
                  'You will provide valid ID',
                  'You understand federal cannabis laws'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 dark:text-green-400 font-bold select-none text-sm">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compact action buttons */}
            <div className="space-y-2 sm:space-y-3">
              <Button 
                onClick={handleVerify}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors duration-200"
                type="button"
                aria-label="Confirm age verification"
              >
                Yes, I am 21+ Minnesota Resident
              </Button>
              
              <Button 
                onClick={handleDecline}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors duration-200"
                type="button"
                aria-label="Decline age verification"
              >
                No, I am under 21
              </Button>
            </div>

            {/* Compact legal disclaimer */}
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
              <p>Cannabis products have not been evaluated by the FDA.</p>
              <p>For use only by adults 21+. Do not drive after use.</p>
              <p className="font-medium">Licensed Minnesota Cannabis Delivery Service</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

export default AgeVerificationModal 