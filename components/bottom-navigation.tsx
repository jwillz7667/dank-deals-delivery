"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, HelpCircle, ShieldCheck, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Menu", href: "/menu", icon: List },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Mission", href: "/mission", icon: ShieldCheck },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  // Generic pre-filled message for the "Text Us" link
  const prefilledMessage = "Hi DankDeals, I have a question."
  const encodedMessage = encodeURIComponent(prefilledMessage)
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
              <item.icon className={cn("h-6 w-6 mb-0.5", isActive ? "text-primary" : "")} />
              {item.name}
            </Link>
          )
        })}
        <a
          href={smsLink} // Updated href with pre-filled message
          className="flex flex-col items-center justify-center w-full h-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Text us your inquiry" // Added aria-label for better accessibility
        >
          <MessageCircle className="h-6 w-6 mb-0.5" />
          Text Us
        </a>
      </div>
    </nav>
  )
}
