"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Truck, Send } from "lucide-react"
import { products, type Product } from "@/lib/products"
import FeaturedProducts from "./featured-products"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

interface BentoGridSectionProps {
  onAiBudtenderClick: (initialMessage?: string) => void
  onProductClick: (product: Product) => void
}

const GlassmorphicCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden ${className}`}
  >
    {children}
  </div>
)

const testimonials = [
  {
    quote:
      "Straight up, the AI Budtender is fire. Nailed what I was looking for. Delivery was quick and low-key. 10/10.",
    author: "J.T., Uptown",
  },
  {
    quote:
      "This ain't your average service. The quality is top-shelf, and the whole delivery process is super chill. My go-to for sure.",
    author: "Maya S., North Loop",
  },
  {
    quote:
      "Was skeptical at first, but damn. The Cosmic Crisp is legit. Super smooth process from text to doorstep. Good looking out, DankDeals.",
    author: "D-Rock, St. Paul",
  },
]

export default function BentoGridSection({ onAiBudtenderClick, onProductClick }: BentoGridSectionProps) {
  const featuredProducts = products.slice(0, 5)
  const [budtenderInput, setBudtenderInput] = useState("")

  const handleBudtenderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAiBudtenderClick(budtenderInput || undefined)
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* AI Budtender CTA - Full width on mobile */}
          <GlassmorphicCard className="md:col-span-2 lg:col-span-2 md:row-span-2 flex flex-col items-center text-center justify-between p-6 sm:p-8">
            <div className="flex flex-col items-center w-full">
              <Image
                src="/king-bud-default.png"
                alt="King Bud - AI Budtender Mascot"
                width={96}
                height={96}
                className="mb-3 sm:mb-4 sm:w-32 sm:h-32"
              />
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Meet Your AI Budtender</h3>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-md">
                Describe your desired mood or occasion, and get personalized recommendations from our menu in seconds.
              </p>
              
              {/* Chat Input Form */}
              <form onSubmit={handleBudtenderSubmit} className="w-full max-w-md mt-6 space-y-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g., 'I need something to help me relax after work'"
                    value={budtenderInput}
                    onChange={(e) => setBudtenderInput(e.target.value)}
                    className="pr-10 bg-white/70 dark:bg-black/50 border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Type your request above or click below for the full experience
                </p>
              </form>
            </div>
            <Button 
              onClick={() => onAiBudtenderClick()} 
              size="lg" 
              className="mt-4 sm:mt-6 w-full sm:w-auto neumorphic-outset"
            >
              <Bot className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Open AI Budtender
            </Button>
          </GlassmorphicCard>

          {/* How Delivery Works */}
          <GlassmorphicCard className="p-6 sm:p-8">
            <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">How Delivery Works</h3>
            <ol className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">1. Browse</span> & choose your items.
              </li>
              <li>
                <span className="font-semibold text-foreground">2. Text Us</span> your complete order.
              </li>
              <li>
                <span className="font-semibold text-foreground">3. Pay</span> & schedule your delivery.
              </li>
              <li>
                <span className="font-semibold text-foreground">4. Verify ID</span> & enjoy!
              </li>
            </ol>
          </GlassmorphicCard>

          {/* Revamped Testimonials Section */}
          <GlassmorphicCard className="p-6 sm:p-8 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground text-center leading-tight">
              Don't Believe Us?
              <br />
              <span className="text-primary text-lg sm:text-xl">Let Our Customers Convince You.</span>
            </h3>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="!pb-8 sm:!pb-10 mt-3 sm:mt-4 w-full"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center text-center">
                  <blockquote className="text-muted-foreground italic text-sm sm:text-base lg:text-lg">"{testimonial.quote}"</blockquote>
                  <p className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base text-foreground/80">- {testimonial.author}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </GlassmorphicCard>

          {/* Featured Products */}
          <GlassmorphicCard className="md:col-span-3 lg:col-span-4 p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">Featured Products</h3>
            <FeaturedProducts products={featuredProducts} onProductClick={onProductClick} />
          </GlassmorphicCard>
        </div>
      </div>
    </section>
  )
}
