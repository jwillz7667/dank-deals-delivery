"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  onCtaClick: () => void
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center text-center text-white aurora-bg"
    >
      <div className="z-10 flex flex-col items-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight"
          style={{ textShadow: "0 4px 15px rgba(0,0,0,0.4)" }}
        >
          Premier Cannabis Delivery
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-primary"
          style={{ textShadow: "0 4px 15px rgba(0,0,0,0.4)" }}
        >
          To The Twin Cities
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-green-100/90"
        >
          Top-shelf flower, edibles, and vapes delivered fast and discreetly to your door.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8"
        >
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-8 px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            Order Now <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
