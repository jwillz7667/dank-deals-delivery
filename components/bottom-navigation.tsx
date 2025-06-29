"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"
import { DankIcon } from "@/lib/icons"
import { useEffect } from "react"

const navItems = [
  { name: "Home", href: "/", icon: "home" as const },
  { name: "Menu", href: "/menu", icon: "cannabis" as const },
  { name: "Cart", href: "/cart", icon: "cart" as const },
  { name: "Profile", href: "/profile", icon: "user" as const },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const { cart } = useCart()

  // Initialize haptic feedback support
  useEffect(() => {
    if ('vibrate' in navigator) {
      // Test vibration API availability
      navigator.vibrate(0);
    }
  }, []);

  const handleNavClick = () => {
    // Haptic feedback on navigation click
    if ('vibrate' in navigator) {
      navigator.vibrate([10]); // Short haptic pulse
    }
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] shadow-2xl gpu-accelerated rounded-t-3xl backdrop-blur-xl border-t border-app-green-500/30 safe-bottom"
      style={{ 
        backgroundColor: '#2B5D3F',
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0'
      }}
    >
      <div className="flex justify-around items-center min-h-[80px] px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith('/menu') && item.href === '/menu')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              aria-label={item.name}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-all duration-300",
                "min-w-[64px] min-h-[64px] px-3 py-2 -m-2", // Ensures 44x44px minimum touch target
                "group hover:scale-110 gpu-accelerated active:scale-95",
                isActive ? "text-white" : "text-white/70 hover:text-white",
              )}
            >
              <div className={cn(
                "relative mb-1.5 p-2.5 rounded-2xl transition-all duration-300",
                "w-11 h-11 flex items-center justify-center", // 44x44px touch target
                isActive ? "bg-white/20 backdrop-blur-sm shadow-lg" : "group-hover:bg-white/10 backdrop-blur-sm"
              )}>
                <DankIcon 
                  name={item.icon}
                  size={26}
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-white scale-110" : "text-white/70 group-hover:text-white group-hover:scale-105"
                  )} 
                />
                {item.name === "Cart" && cart && cart.itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500 hover:bg-red-600 border-2 border-app-green-600 animate-pulse shadow-lg"
                  >
                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs font-semibold transition-all duration-300 leading-tight",
                isActive ? "text-white opacity-100" : "text-white/70 group-hover:text-white"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          )
        })}
      </div>
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-app-green-700/20 to-app-green-600/5 pointer-events-none rounded-t-3xl"></div>
    </nav>
  )
}
