"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image" // Import Next.js Image component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Sparkles, Send } from "lucide-react"
import { products, type Product } from "@/lib/products"

interface AiBudtenderModalProps {
  isOpen: boolean
  onClose: () => void
  onProductSelect: (product: Product) => void
}

interface Recommendation {
  productId: number
  reason: string
}

export default function AiBudtenderModal({ isOpen, onClose, onProductSelect }: AiBudtenderModalProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      toast({
        title: "Uh oh!",
        description: "Please describe what you're looking for.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    setRecommendations([])

    try {
      const response = await fetch("/api/ai-budtender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Failed to get recommendations.")
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error(error)
      toast({
        title: "An error occurred",
        description: "Couldn't get recommendations. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductClick = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      onProductSelect(product)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic-card sm:max-w-2xl p-8">
        <DialogHeader className="flex flex-row items-center gap-4">
          <Image
            src="/king-bud-default.png"
            alt="AI Budtender King Bud"
            width={64} // Adjust size as needed
            height={64}
            className="rounded-full object-cover" // Optional: if you want a circular avatar
          />
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">AI Budtender</DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300 mt-1">
              Your personal cannabis connoisseur!
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <Textarea
            placeholder="Tell me what you're looking for... (e.g., 'relax after work but not fall asleep')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] bg-white/50 dark:bg-black/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="mt-4 w-full neumorphic-outset dark:neumorphic-outset-dark"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Get Recommendations
          </Button>
        </form>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
              <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
              Here are my suggestions:
            </h3>
            <div className="mt-4 space-y-4">
              {recommendations.map((rec) => {
                const product = products.find((p) => p.id === rec.productId)
                if (!product) return null
                return (
                  <div key={rec.productId} className="flex gap-4 p-4 rounded-lg bg-white/30 dark:bg-black/30">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{rec.reason}</p>
                      <Button
                        variant="link"
                        className="p-0 h-auto mt-2 text-green-600 dark:text-green-400"
                        onClick={() => handleProductClick(product.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
