"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, HelpCircle, ShieldCheck, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Menu", href: "/menu", icon: List },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Mission", href: "/mission", icon: ShieldCheck },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  const orderMessage = "Hi! I'd like to place an order."
  const encodedMessage = encodeURIComponent(orderMessage)
  const smsLink = `sms:+16129301390?&body=${encodedMessage}`

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
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} />
              {item.name}
            </Link>
          )
        })}
        <a
          href={smsLink}
          className="flex flex-col items-center justify-center w-full h-full text-xs font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors bg-green-50 dark:bg-green-900/20"
          aria-label="Order now via text message"
        >
          <MessageSquare className="h-5 w-5 mb-0.5 text-green-600 dark:text-green-400" />
          Order Now
        </a>
      </div>
    </nav>
  )
}
