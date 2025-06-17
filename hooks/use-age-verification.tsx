"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AgeVerificationContextType {
  isVerified: boolean
  showModal: boolean
  verifyAge: () => void
  declineVerification: () => void
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined)

interface AgeVerificationProviderProps {
  children: ReactNode
}

export function AgeVerificationProvider({ children }: AgeVerificationProviderProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check if user has verified age in current session
    const hasVerified = sessionStorage.getItem('ageVerified') === 'true'
    
    if (hasVerified) {
      setIsVerified(true)
      setShowModal(false)
    } else {
      setIsVerified(false)
      setShowModal(true)
    }
  }, [])

  const verifyAge = () => {
    sessionStorage.setItem('ageVerified', 'true')
    setIsVerified(true)
    setShowModal(false)
  }

  const declineVerification = () => {
    // Redirect to external site or show warning
    window.location.href = 'https://www.samhsa.gov/find-help/national-helpline'
  }

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return null
  }

  const value = {
    isVerified,
    showModal,
    verifyAge,
    declineVerification
  }

  return (
    <AgeVerificationContext.Provider value={value}>
      {children}
    </AgeVerificationContext.Provider>
  )
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext)
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider')
  }
  return context
} 