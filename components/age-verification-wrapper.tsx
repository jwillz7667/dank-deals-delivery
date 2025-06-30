"use client"

import { useAgeVerification } from "@/hooks/use-age-verification"
import { ReactNode, memo, Suspense, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamic import for age verification modal - only loads when needed
const AgeVerificationModal = dynamic(() => import("./age-verification-modal"), {
  loading: () => null, // No loading state since this appears as an overlay
  ssr: false // This modal is client-side only
})

interface AgeVerificationWrapperProps {
  children: ReactNode
}

// Main wrapper with critical performance optimizations
export default function AgeVerificationWrapper({ children }: AgeVerificationWrapperProps) {
  const { isVerified, showModal, verifyAge, declineVerification } = useAgeVerification()

  useEffect(() => {
    // Modal state is managed by the age verification context
    // No need to manage local state here
  }, [])

  return (
    <>
      {children}
      {/* Only render modal when showModal is true - saves ~50KB on initial load */}
      {showModal && (
        <AgeVerificationModal 
          isOpen={showModal}
          onVerify={verifyAge}
          onDecline={declineVerification}
        />
      )}
    </>
  )
} 