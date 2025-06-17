"use client"

import { useAgeVerification } from "@/hooks/use-age-verification"
import AgeVerificationModal from "./age-verification-modal"
import { ReactNode } from "react"

interface AgeVerificationWrapperProps {
  children: ReactNode
}

export default function AgeVerificationWrapper({ children }: AgeVerificationWrapperProps) {
  const { isVerified, showModal, verifyAge, declineVerification } = useAgeVerification()

  return (
    <>
      {/* Content - only show if verified or during initial load */}
      <div className={`${!isVerified && showModal ? 'blur-sm pointer-events-none' : ''}`}>
        {children}
      </div>
      
      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={showModal}
        onVerify={verifyAge}
        onDecline={declineVerification}
      />
    </>
  )
} 