"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react"

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
  const [isHydrated, setIsHydrated] = useState(false)

  // Optimized hydration effect
  useEffect(() => {
    // Use single effect for hydration and verification check
    const checkVerification = () => {
      setIsHydrated(true)
      
      // Check sessionStorage once during hydration
      try {
        const hasVerified = sessionStorage.getItem('ageVerified') === 'true'
        if (hasVerified) {
          setIsVerified(true)
          setShowModal(false)
        } else {
          setIsVerified(false)
          // Use requestAnimationFrame to prevent layout thrashing
          requestAnimationFrame(() => {
            setShowModal(true)
          })
        }
      } catch (error) {
        // Fallback for environments without sessionStorage
        setIsVerified(false)
        setShowModal(true)
      }
    }

    checkVerification()
  }, [])

  // Memoized callback to prevent unnecessary re-renders
  const verifyAge = useCallback(() => {
    try {
      sessionStorage.setItem('ageVerified', 'true')
    } catch (error) {
      // Handle sessionStorage errors gracefully
      console.warn('Could not save age verification to sessionStorage')
    }
    
    setIsVerified(true)
    setShowModal(false)
  }, [])

  // Memoized callback with optimized redirect
  const declineVerification = useCallback(() => {
    // Use replace instead of href for better performance
    window.location.replace('https://www.samhsa.gov/find-help/national-helpline')
  }, [])

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isVerified,
    showModal,
    verifyAge,
    declineVerification
  }), [isVerified, showModal, verifyAge, declineVerification])

  // Prevent flash of content before hydration
  if (!isHydrated) {
    return <div className="opacity-0" aria-hidden="true">{children}</div>
  }

  return (
    <AgeVerificationContext.Provider value={contextValue}>
      {children}
    </AgeVerificationContext.Provider>
  )
}

// Optimized hook with error boundary
export function useAgeVerification() {
  const context = useContext(AgeVerificationContext)
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider')
  }
  return context
} 