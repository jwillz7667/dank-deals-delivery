"use client"

import { useAgeVerification } from "@/hooks/use-age-verification"
import { ReactNode, memo, Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Critical loading optimization: Only load modal when absolutely needed
const AgeVerificationModal = dynamic(() => import("./age-verification-modal"), {
  loading: () => null,
  ssr: false // No SSR needed for modal overlay
})

interface AgeVerificationWrapperProps {
  children: ReactNode
}

// Inner component with optimized blur effects
const AgeVerificationContent = memo(function AgeVerificationContent({ 
  children 
}: AgeVerificationWrapperProps) {
  const { isVerified, showModal, verifyAge, declineVerification } = useAgeVerification()

  return (
    <>
      {/* Enhanced blur effect with performance optimizations */}
      <div 
        className={`
          min-h-screen transition-all duration-300 ease-out
          ${!isVerified && showModal 
            ? 'blur-[4px] sm:blur-[6px] pointer-events-none select-none brightness-75 contrast-75' 
            : 'blur-0 pointer-events-auto select-auto brightness-100 contrast-100'
          }
        `}
        style={{
          filter: !isVerified && showModal 
            ? 'blur(4px) brightness(0.75) contrast(0.75)' 
            : 'none',
          WebkitFilter: !isVerified && showModal 
            ? 'blur(4px) brightness(0.75) contrast(0.75)' 
            : 'none',
          willChange: !isVerified && showModal ? 'filter' : 'auto',
          transform: !isVerified && showModal ? 'scale(1.02)' : 'scale(1)',
          transformOrigin: 'center center'
        }}
        aria-hidden={!isVerified && showModal}
        inert={!isVerified && showModal ? true : undefined}
      >
        {children}
      </div>
      
      {/* Optimized modal loading */}
      {showModal && (
        <Suspense fallback={
          <div 
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            role="dialog"
            aria-label="Loading age verification"
          >
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <AgeVerificationModal
            isOpen={showModal}
            onVerify={verifyAge}
            onDecline={declineVerification}
          />
        </Suspense>
      )}
    </>
  )
})

// Main wrapper with critical performance optimizations
const AgeVerificationWrapper = memo(function AgeVerificationWrapper({ 
  children 
}: AgeVerificationWrapperProps) {
  const [isClientReady, setIsClientReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Optimized hydration with error handling
    try {
      // Use RAF for smoother hydration
      requestAnimationFrame(() => {
        setIsClientReady(true)
      })
    } catch (error) {
      console.error('Age verification hydration error:', error)
      setHasError(true)
      setIsClientReady(true) // Still render content on error
    }
  }, [])

  // Error boundary fallback
  if (hasError) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }

  // Performance-optimized SSR/hydration handling
  if (!isClientReady) {
    return (
      <div 
        className="min-h-screen opacity-0 animate-pulse"
        style={{ 
          visibility: 'hidden',
          contain: 'layout style paint'
        }}
        aria-hidden="true"
      >
        {children}
      </div>
    )
  }

  // Client-side render with full age verification
  return <AgeVerificationContent>{children}</AgeVerificationContent>
})

export default AgeVerificationWrapper 