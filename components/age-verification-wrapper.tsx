"use client"

import { useAgeVerification } from "@/hooks/use-age-verification"
import { ReactNode, memo, Suspense } from "react"
import dynamic from "next/dynamic"

// Lazy load the modal only when needed to reduce initial bundle size
const AgeVerificationModal = dynamic(() => import("./age-verification-modal"), {
  loading: () => null, // No loading component needed since it's a modal
  ssr: false // Modal doesn't need server-side rendering
})

interface AgeVerificationWrapperProps {
  children: ReactNode
}

// Memoized wrapper to prevent unnecessary re-renders
const AgeVerificationWrapper = memo(function AgeVerificationWrapper({ 
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

export default AgeVerificationWrapper 