"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "FAQ", href: "/faq" },
    { name: "Our Mission", href: "/mission" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/dankdeals-logo.png"
              alt="DankDeals.org Logo"
              width={160}
              height={36}
              priority
              className="object-contain w-32 h-7 sm:w-40 sm:h-9 md:w-48 md:h-11 lg:w-56 lg:h-12 xl:w-64 xl:h-14"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-base lg:text-lg font-medium text-muted-foreground hover:text-primary transition-colors",
                  pathname === link.href && "text-primary",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
            <Button 
              className="neumorphic-outset bg-green-600 hover:bg-green-700 text-white border-green-700 text-sm sm:text-base"
              size="default"
            >
              <MessageSquare className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Order Now</span>
              <span className="sm:hidden">Order</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  )
}
