"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageSquare, ShoppingCart, User, LogOut, Package, UserCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useUser } from "@stackframe/stack"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { cart } = useCart()
  const user = useUser()

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

  const handleSignOut = async () => {
    await user?.signOut()
    router.push('/')
  }

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
              width={216}
              height={49}
              priority
              className="object-contain w-44 h-10 sm:w-56 sm:h-12 md:w-64 md:h-14 lg:w-72 lg:h-16 xl:w-80 xl:h-20"
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart Button */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart && cart.itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {cart.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-medium">{user.displayName}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.primaryEmail}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile?tab=orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  onClick={() => router.push('/handler/sign-in')}
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button 
                  variant="default"
                  onClick={() => router.push('/handler/sign-up')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Order Now Button */}
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
      </div>
    </header>
  )
}
