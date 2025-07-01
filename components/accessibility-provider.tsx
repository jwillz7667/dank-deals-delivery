"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface AccessibilitySettings {
  // Motion and animation preferences
  prefersReducedMotion: boolean
  
  // Visual preferences
  highContrastMode: boolean
  largeTextMode: boolean
  
  // Navigation preferences
  keyboardNavigationActive: boolean
  screenReaderActive: boolean
  
  // User interaction preferences
  skipLinksVisible: boolean
  focusVisible: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  manageFocus: (element: HTMLElement | null) => void
  trapFocus: (container: HTMLElement) => () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// Screen reader announcements
class ScreenReaderAnnouncer {
  private liveRegions: Map<string, HTMLElement> = new Map()

  constructor() {
    this.createLiveRegions()
  }

  private createLiveRegions() {
    // Create polite live region
    const politeRegion = document.createElement('div')
    politeRegion.setAttribute('aria-live', 'polite')
    politeRegion.setAttribute('aria-atomic', 'true')
    politeRegion.setAttribute('class', 'sr-only')
    politeRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `
    document.body.appendChild(politeRegion)
    this.liveRegions.set('polite', politeRegion)

    // Create assertive live region for urgent announcements
    const assertiveRegion = document.createElement('div')
    assertiveRegion.setAttribute('aria-live', 'assertive')
    assertiveRegion.setAttribute('aria-atomic', 'true')
    assertiveRegion.setAttribute('class', 'sr-only')
    assertiveRegion.style.cssText = politeRegion.style.cssText
    document.body.appendChild(assertiveRegion)
    this.liveRegions.set('assertive', assertiveRegion)
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const region = this.liveRegions.get(priority)
    if (region) {
      // Clear previous message
      region.textContent = ''
      
      // Add new message after a small delay to ensure screen readers pick it up
      setTimeout(() => {
        region.textContent = message
      }, 100)
      
      // Clear message after announcement
      setTimeout(() => {
        region.textContent = ''
      }, 1000)
    }
  }
}

// Focus management utilities
class FocusManager {
  private focusHistory: HTMLElement[] = []
  private trapElement: HTMLElement | null = null
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
    'audio[controls]',
    'video[controls]',
    'iframe',
    'object',
    'embed',
    'area[href]',
    'summary',
  ].join(',')

  getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors))
      .filter(element => this.isVisible(element)) as HTMLElement[]
  }

  private isVisible(element: Element): boolean {
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           (element as HTMLElement).offsetParent !== null
  }

  manageFocus(element: HTMLElement | null) {
    if (element && element !== document.activeElement) {
      // Store current focus for restoration
      if (document.activeElement && document.activeElement !== document.body) {
        this.focusHistory.push(document.activeElement as HTMLElement)
      }
      
      element.focus()
      
      // Add focus indicator for programmatic focus
      element.setAttribute('data-focus-managed', 'true')
      setTimeout(() => {
        element.removeAttribute('data-focus-managed')
      }, 100)
    }
  }

  restoreFocus() {
    const lastFocusedElement = this.focusHistory.pop()
    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus()
    }
  }

  trapFocus(container: HTMLElement): () => void {
    this.trapElement = container
    const focusableElements = this.getFocusableElements(container)
    
    if (focusableElements.length === 0) return () => {}

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.restoreFocus()
        container.removeEventListener('keydown', handleTabKey)
        container.removeEventListener('keydown', handleEscapeKey)
      }
    }

    container.addEventListener('keydown', handleTabKey)
    container.addEventListener('keydown', handleEscapeKey)

    // Focus first element
    firstElement.focus()

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
      container.removeEventListener('keydown', handleEscapeKey)
      this.trapElement = null
    }
  }
}

// Keyboard navigation helper
const setupKeyboardNavigation = () => {
  // Global keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // Skip to main content (Alt + M)
    if (event.altKey && event.key === 'm') {
      event.preventDefault()
      const mainContent = document.getElementById('main-content') || document.querySelector('main')
      if (mainContent) {
        (mainContent as HTMLElement).focus()
        mainContent.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Skip to navigation (Alt + N)
    if (event.altKey && event.key === 'n') {
      event.preventDefault()
      const navigation = document.querySelector('nav[role="navigation"]') || document.querySelector('nav')
      if (navigation) {
        const firstLink = navigation.querySelector('a')
        if (firstLink) {
          (firstLink as HTMLElement).focus()
        }
      }
    }

    // Open accessibility menu (Alt + A)
    if (event.altKey && event.key === 'a') {
      event.preventDefault()
      const accessibilityMenu = document.getElementById('accessibility-menu')
      if (accessibilityMenu) {
        (accessibilityMenu as HTMLElement).focus()
      }
    }
  })

  // Enhanced focus visibility
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-navigation-active')
    }
  })

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation-active')
  })
}

export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    prefersReducedMotion: false,
    highContrastMode: false,
    largeTextMode: false,
    keyboardNavigationActive: false,
    screenReaderActive: false,
    skipLinksVisible: false,
    focusVisible: true,
  })

  const [announcer] = useState(() => new ScreenReaderAnnouncer())
  const [focusManager] = useState(() => new FocusManager())

  useEffect(() => {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    const hasScreenReader = 'speechSynthesis' in window || navigator.userAgent.includes('NVDA') || 
                           navigator.userAgent.includes('JAWS') || navigator.userAgent.includes('ORCA')

    setSettings(prev => ({
      ...prev,
      prefersReducedMotion,
      highContrastMode: prefersHighContrast,
      screenReaderActive: hasScreenReader,
    }))

    // Load saved preferences
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error)
      }
    }

    // Setup global accessibility features
    setupKeyboardNavigation()

    // Listen for media query changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, prefersReducedMotion: e.matches }))
    }

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrastMode: e.matches }))
    }

    motionQuery.addListener(handleMotionChange)
    contrastQuery.addListener(handleContrastChange)

    return () => {
      motionQuery.removeListener(handleMotionChange)
      contrastQuery.removeListener(handleContrastChange)
    }
  }, [])

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement

    // Reduced motion
    if (settings.prefersReducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // High contrast
    if (settings.highContrastMode) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text
    if (settings.largeTextMode) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Keyboard navigation
    if (settings.keyboardNavigationActive) {
      root.classList.add('keyboard-navigation-active')
    } else {
      root.classList.remove('keyboard-navigation-active')
    }

    // Focus visibility
    if (settings.focusVisible) {
      root.classList.add('focus-visible-enhanced')
    } else {
      root.classList.remove('focus-visible-enhanced')
    }

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Announce changes to screen readers
    announcer.announce(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`)
  }, [announcer])

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announcer.announce(message, priority)
  }, [announcer])

  const manageFocus = useCallback((element: HTMLElement | null) => {
    focusManager.manageFocus(element)
  }, [focusManager])

  const trapFocus = useCallback((container: HTMLElement) => {
    return focusManager.trapFocus(container)
  }, [focusManager])

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    announceToScreenReader,
    manageFocus,
    trapFocus,
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Skip Links */}
      <div className="skip-links">
        <a 
          href="#main-content" 
          className="skip-link"
          onFocus={() => setSettings(prev => ({ ...prev, skipLinksVisible: true }))}
        >
          Skip to main content
        </a>
        <a href="#navigation" className="skip-link">
          Skip to navigation
        </a>
        <a href="#search" className="skip-link">
          Skip to search
        </a>
      </div>

      {/* Enhanced CSS for accessibility */}
      <style jsx global>{`
        /* Skip links */
        .skip-links {
          position: absolute;
          top: -40px;
          left: 6px;
          z-index: 9999;
        }
        
        .skip-link {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        
        .skip-link:focus {
          position: static;
          width: auto;
          height: auto;
          left: auto;
          top: auto;
        }

        /* Reduced motion */
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* High contrast mode */
        .high-contrast {
          --background: #000;
          --foreground: #fff;
          --primary: #00ff00;
          --border: #fff;
        }

        .high-contrast * {
          border-color: currentColor !important;
        }

        /* Large text mode */
        .large-text {
          font-size: 120% !important;
        }

        .large-text * {
          font-size: inherit !important;
        }

        /* Enhanced focus visibility */
        .focus-visible-enhanced *:focus,
        .keyboard-navigation-active *:focus {
          outline: 3px solid #005fcc !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 1px #fff, 0 0 0 4px #005fcc !important;
        }

        /* Focus management */
        [data-focus-managed="true"] {
          outline: 3px solid #ff6b35 !important;
          outline-offset: 2px !important;
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
      `}</style>

      {children}
    </AccessibilityContext.Provider>
  )
} 