"use client"

import { useAgeVerification } from "@/hooks/use-age-verification"
import { ReactNode, memo, Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Lazy load the modal only when needed to reduce initial bundle size
const AgeVerificationModal = dynamic(() => import("./age-verification-modal"), {
  loading: () => null, // No loading component needed since it's a modal
  ssr: false // Modal doesn't need server-side rendering
})

interface AgeVerificationWrapperProps {
  children: ReactNode
}

// Inner component that uses the hook - separated to handle context properly
const AgeVerificationContent = memo(function AgeVerificationContent({ 
  children 
}: AgeVerificationWrapperProps) {
  const { isVerified, showModal, verifyAge, declineVerification } = useAgeVerification()

  return (
    <>
      {/* Content - optimized blur effect */}
      <div 
        className={`transition-all duration-300 ${
          !isVerified && showModal 
            ? 'blur-sm pointer-events-none select-none' 
            : ''
        }`}
        style={{
          filter: !isVerified && showModal ? 'blur(4px)' : 'none',
          WebkitFilter: !isVerified && showModal ? 'blur(4px)' : 'none'
        }}
      >
        {children}
      </div>
      
      {/* Lazy loaded Age Verification Modal - only render when needed */}
      {showModal && (
        <Suspense fallback={null}>
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

// Main wrapper with hydration handling
const AgeVerificationWrapper = memo(function AgeVerificationWrapper({ 
  children 
}: AgeVerificationWrapperProps) {
  const [isClientReady, setIsClientReady] = useState(false)

  useEffect(() => {
    // Ensure client-side hydration is complete
    setIsClientReady(true)
  }, [])

  // During SSR and initial hydration, render without age verification
  if (!isClientReady) {
    return <div className="opacity-0">{children}</div>
  }

  // Client-side render with age verification
  return <AgeVerificationContent>{children}</AgeVerificationContent>
})

export default AgeVerificationWrapper 