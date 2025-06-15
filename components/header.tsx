"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageSquare, ShoppingCart, User, LogOut, Package, UserCircle, Search, Menu, X } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function UserSection() {
  const user = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await user?.signOut()
    router.push('/')
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 gpu-accelerated">
            <User className="h-5 w-5 text-app-green-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 modal-glass border-white/30">
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
          <DropdownMenuItem onClick={() => router.push('/profile')} className="hover:bg-app-green-50/80 transition-colors duration-200">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile?tab=orders')} className="hover:bg-app-green-50/80 transition-colors duration-200">
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50/80 transition-colors duration-200">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost"
        onClick={() => router.push('/handler/sign-in')}
        className="hidden sm:flex text-app-green-600 hover:bg-white/20 backdrop-blur-sm rounded-full px-4 transition-all duration-300 hover:scale-105 gpu-accelerated"
      >
        Sign In
      </Button>
      <Button 
        variant="default"
        onClick={() => router.push('/handler/sign-up')}
        className="primary-button"
      >
        Sign Up
      </Button>
    </div>
  )
}

function MobileMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "FAQ", href: "/faq" },
    { name: "Our Mission", href: "/mission" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 gpu-accelerated">
          <Menu className="h-5 w-5 text-app-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-6 modal-glass">
        <DialogHeader>
          <DialogTitle className="flex justify-center mb-2">
            <Image
              src="/DANKDEALSMN.COM-LOGO.png" 
              alt="DankDealsMN.com Logo"
              width={180}
              height={40}
              className="object-contain h-10 w-auto"
            />
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block py-3 px-4 text-lg font-medium rounded-2xl transition-all duration-300 hover:scale-105 gpu-accelerated",
                pathname === link.href 
                  ? "bg-app-green-600 text-white shadow-lg" 
                  : "text-muted-foreground hover:text-app-green-600 hover:bg-app-green-50/80 backdrop-blur-sm",
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-6 border-t border-white/20 space-y-3">
            <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
              <Button className="w-full primary-button">
                <MessageSquare className="mr-2 h-4 w-4" />
                Text to Order
              </Button>
            </a>
            <a href="tel:+16129301390">
              <Button variant="outline" className="w-full secondary-button">
                Call (612) 930-1390
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { cart } = useCart()

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-glass gpu-accelerated",
        isScrolled && "shadow-lg backdrop-blur-xl"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Image
                src="/DANKDEALSMN.COM-LOGO.png"
                alt="DankDealsMN.com Logo"
                width={360}
                height={80}
                className="object-contain h-16 w-auto sm:h-20 lg:h-24 transition-all duration-300 group-hover:scale-105 gpu-accelerated"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-base font-medium transition-all duration-300 hover:text-app-green-600 hover:scale-105 gpu-accelerated px-3 py-2 rounded-full",
                  pathname === link.href 
                    ? "text-app-green-600 bg-app-green-50/80 backdrop-blur-sm shadow-md" 
                    : "text-muted-foreground hover:bg-white/20 backdrop-blur-sm",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Button - Desktop only */}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden lg:flex hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 gpu-accelerated"
              onClick={() => {
                // Add search functionality later if needed
              }}
            >
              <Search className="h-5 w-5 text-app-green-600" />
            </Button>

            {/* Cart Button */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 gpu-accelerated"
              >
                <ShoppingCart className="h-5 w-5 text-app-green-600" />
                {cart && cart.itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-app-green-600 hover:bg-app-green-700 animate-pulse shadow-lg"
                  >
                    {cart.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth Section - Desktop */}
            <div className="hidden lg:block">
              <UserSection />
            </div>

            {/* Mobile Auth Button */}
            <div className="lg:hidden">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => {
                  // Handle mobile auth
                }}
                className="hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 gpu-accelerated"
              >
                <User className="h-5 w-5 text-app-green-600" />
              </Button>
            </div>

            {/* Order Now Button - Desktop only */}
            <a href="sms:+16129301390?&body=Hi! I'd like to place an order." className="hidden lg:block">
              <Button 
                className="primary-button animate-glow"
                size="default"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Text to Order
              </Button>
            </a>

            {/* Mobile Menu - Far Right */}
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
