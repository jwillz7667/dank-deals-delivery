"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageCircle } from "lucide-react"
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
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/dankdeals-logo.png"
              alt="DankDeals.org Logo"
              width={144} // Adjusted width (180 * 0.8)
              height={32} // Adjusted height (40 * 0.8)
              priority
              className="object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-lg font-medium text-muted-foreground hover:text-primary transition-colors",
                  pathname === link.href && "text-primary",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <a href="sms:+16129301390">
            <Button className="neumorphic-outset">
              <MessageCircle className="mr-2 h-5 w-5" />
              Text Us Now
            </Button>
          </a>
        </div>
      </div>
    </header>
  )
}
