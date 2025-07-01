"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"
import { DankIcon } from "@/lib/icons"
import { useEffect, useRef } from "react"
import { useAccessibility } from "@/components/accessibility-provider"

const navItems = [
  { 
    name: "Home", 
    href: "/", 
    icon: "home" as const,
    ariaLabel: "Go to homepage",
    description: "Return to the main page"
  },
  { 
    name: "Menu", 
    href: "/menu", 
    icon: "cannabis" as const,
    ariaLabel: "Browse cannabis products menu",
    description: "View our full product catalog"
  },
  { 
    name: "Cart", 
    href: "/cart", 
    icon: "cart" as const,
    ariaLabel: "View shopping cart",
    description: "Review items in your cart"
  },
  { 
    name: "Profile", 
    href: "/profile", 
    icon: "user" as const,
    ariaLabel: "Access user profile",
    description: "Manage your account and orders"
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const { cart } = useCart()
  const { announceToScreenReader, settings } = useAccessibility()
  const navigationRef = useRef<HTMLElement>(null)
  const previousCartCount = useRef(cart?.itemCount || 0)

  // Initialize haptic feedback support
  useEffect(() => {
    if ('vibrate' in navigator) {
      // Test vibration API availability
      navigator.vibrate(0);
    }
  }, []);

  // Announce cart changes to screen readers
  useEffect(() => {
    if (cart?.itemCount !== previousCartCount.current) {
      const difference = (cart?.itemCount || 0) - previousCartCount.current
      if (difference > 0) {
        announceToScreenReader(
          `Added ${difference} item${difference !== 1 ? 's' : ''} to cart. Total: ${cart?.itemCount || 0} items.`,
          'polite'
        )
      } else if (difference < 0) {
        announceToScreenReader(
          `Removed ${Math.abs(difference)} item${Math.abs(difference) !== 1 ? 's' : ''} from cart. Total: ${cart?.itemCount || 0} items.`,
          'polite'
        )
      }
      previousCartCount.current = cart?.itemCount || 0
    }
  }, [cart?.itemCount, announceToScreenReader])

  const handleNavClick = (itemName: string) => {
    // Haptic feedback on navigation click
    if ('vibrate' in navigator && !settings.prefersReducedMotion) {
      navigator.vibrate([10]); // Short haptic pulse
    }

    // Announce navigation to screen readers
    announceToScreenReader(`Navigating to ${itemName}`, 'polite')
  };

  const handleKeyDown = (event: React.KeyboardEvent, href: string, itemName: string) => {
    // Handle keyboard navigation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleNavClick(itemName)
      // Programmatically navigate
      window.location.href = href
    }

    // Arrow key navigation within bottom nav
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const currentIndex = navItems.findIndex(item => item.href === pathname)
      let nextIndex: number

      if (event.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1
      } else {
        nextIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0
      }

      const nextLink = navigationRef.current?.querySelectorAll('[role="tab"]')[nextIndex] as HTMLElement
      nextLink?.focus()
    }
  }

  return (
    <nav 
      ref={navigationRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] shadow-2xl gpu-accelerated rounded-t-3xl backdrop-blur-xl border-t border-app-green-500/30 safe-bottom"
      style={{ 
        backgroundColor: '#2B5D3F',
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0'
      }}
      role="tablist"
      aria-label="Main navigation"
      aria-orientation="horizontal"
    >
      {/* Screen reader only description */}
      <div className="sr-only">
        Main navigation with {navItems.length} items. Use arrow keys to navigate between items.
      </div>

      <div className="flex justify-around items-center min-h-[80px] px-4">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || (pathname.startsWith('/menu') && item.href === '/menu')
          const cartItemCount = item.name === "Cart" ? cart?.itemCount || 0 : 0
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item.name)}
              onKeyDown={(event) => handleKeyDown(event, item.href, item.name)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.name.toLowerCase()}`}
              aria-label={`${item.ariaLabel}${cartItemCount > 0 ? `. ${cartItemCount} items in cart` : ''}`}
              aria-describedby={`desc-${item.name.toLowerCase()}`}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-all duration-300",
                "min-w-[64px] min-h-[64px] px-3 py-2 -m-2", // Ensures 44x44px minimum touch target (WCAG AA)
                "group hover:scale-110 gpu-accelerated active:scale-95 focus:scale-110",
                "rounded-xl", // Better touch target definition
                isActive ? "text-white" : "text-white/70 hover:text-white focus:text-white",
                // Enhanced focus styles for accessibility
                "focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-app-green-600"
              )}
            >
              {/* Hidden description for screen readers */}
              <span id={`desc-${item.name.toLowerCase()}`} className="sr-only">
                {item.description}
              </span>

              <div className={cn(
                "relative mb-1.5 p-2.5 rounded-2xl transition-all duration-300",
                "w-11 h-11 flex items-center justify-center", // 44x44px touch target
                isActive ? "bg-white/20 backdrop-blur-sm shadow-lg" : "group-hover:bg-white/10 group-focus:bg-white/15 backdrop-blur-sm"
              )}>
                <DankIcon 
                  name={item.icon}
                  size={26}
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-white scale-110" : "text-white/70 group-hover:text-white group-focus:text-white group-hover:scale-105 group-focus:scale-105"
                  )}
                  aria-hidden="true" // Icon is decorative, label provides context
                />
                
                {/* Cart badge with accessibility features */}
                {item.name === "Cart" && cartItemCount > 0 && (
                  <Badge 
                    className={cn(
                      "absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]",
                      "bg-red-500 hover:bg-red-600 border-2 border-app-green-600 shadow-lg",
                      // Reduced animation if user prefers reduced motion
                      settings.prefersReducedMotion ? "" : "animate-pulse"
                    )}
                    aria-label={`${cartItemCount} items in cart`}
                    role="status"
                    aria-live="polite"
                  >
                    <span aria-hidden="true">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                    <span className="sr-only">
                      {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in shopping cart
                    </span>
                  </Badge>
                )}
              </div>
              
              {/* Navigation label */}
              <span className={cn(
                "text-xs font-semibold transition-all duration-300 leading-tight",
                isActive ? "text-white opacity-100" : "text-white/70 group-hover:text-white group-focus:text-white"
              )}>
                {item.name}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  style={{
                    animation: settings.prefersReducedMotion ? 'none' : 'pulse 2s infinite'
                  }}
                  aria-hidden="true"
                />
              )}
            </Link>
          )
        })}
      </div>
      
      {/* Glass effect overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-app-green-700/20 to-app-green-600/5 pointer-events-none rounded-t-3xl"
        aria-hidden="true"
      />

      {/* Enhanced CSS for touch and accessibility */}
      <style jsx>{`
        /* Ensure proper touch targets on all devices */
        @media (pointer: coarse) {
          nav [role="tab"] {
            min-width: 48px !important;
            min-height: 48px !important;
          }
        }

        /* Enhanced focus styles for high contrast mode */
        .high-contrast nav [role="tab"]:focus {
          outline: 3px solid #ffffff !important;
          outline-offset: 2px !important;
          background-color: #000000 !important;
        }

        /* Ensure proper contrast in high contrast mode */
        .high-contrast nav {
          background-color: #000000 !important;
          border-color: #ffffff !important;
        }

        .high-contrast nav [role="tab"] {
          color: #ffffff !important;
        }

        /* Reduced motion animations */
        .reduce-motion nav [role="tab"] {
          transition: none !important;
        }

        .reduce-motion nav [role="tab"] * {
          animation: none !important;
          transition: none !important;
        }

        /* Large text support */
        .large-text nav [role="tab"] {
          font-size: 1.1em !important;
        }

        .large-text nav [role="tab"] span {
          font-size: inherit !important;
        }
      `}</style>
    </nav>
  )
}
