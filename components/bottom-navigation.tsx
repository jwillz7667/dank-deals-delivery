"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Menu", href: "/menu", icon: List },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Profile", href: "/profile", icon: User },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const { cart } = useCart()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} />
                {item.name === "Cart" && cart && cart.itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {cart.itemCount}
                  </Badge>
                )}
              </div>
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
