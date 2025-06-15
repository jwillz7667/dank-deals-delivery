"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3x3, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Categories", href: "/menu", icon: Grid3x3 },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Profile", href: "/profile", icon: User },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const { cart } = useCart()

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 shadow-2xl gpu-accelerated rounded-t-3xl backdrop-blur-xl border-t border-app-green-500/30"
      style={{ backgroundColor: '#2B5D3F' }}
    >
      <div className="flex justify-around items-center h-20 px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith('/menu') && item.href === '/menu')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-all duration-300 min-w-[60px] group hover:scale-110 gpu-accelerated",
                isActive ? "text-white" : "text-white/70 hover:text-white",
              )}
            >
              <div className={cn(
                "relative mb-1 p-2 rounded-2xl transition-all duration-300",
                isActive ? "bg-white/20 backdrop-blur-sm shadow-lg" : "group-hover:bg-white/10 backdrop-blur-sm"
              )}>
                <item.icon 
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive ? "text-white scale-110" : "text-white/70 group-hover:text-white group-hover:scale-105"
                  )} 
                />
                {item.name === "Cart" && cart && cart.itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500 hover:bg-red-600 border-2 border-app-green-600 animate-pulse shadow-lg"
                  >
                    {cart.itemCount}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-[11px] font-medium transition-all duration-300",
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
