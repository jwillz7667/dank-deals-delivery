"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image" // Import Next.js Image component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Sparkles, Send, Cannabis } from "lucide-react"
import { products, type Product } from "@/lib/products"

interface AiBudtenderModalProps {
  isOpen: boolean
  onClose: () => void
  onProductSelect: (product: Product) => void
  initialMessage?: string
}

interface ConversationalRecommendation {
  productId: number
  introduction: string
  whyItsGreat: string
  personalNote: string
}

interface BudtenderResponse {
  greeting: string
  personalInsight: string
  recommendations: ConversationalRecommendation[]
  closingMessage: string
}

export default function AiBudtenderModal({ isOpen, onClose, onProductSelect, initialMessage }: AiBudtenderModalProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<BudtenderResponse | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const { toast } = useToast()

  const submitQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      toast({
        title: "Hey there!",
        description: "Tell me what kind of experience you're looking for.",
        variant: "default",
      })
      return
    }
    setIsLoading(true)
    setShowWelcome(false)
    setResponse(null)

    try {
      const apiResponse = await fetch("/api/ai-budtender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      })

      if (!apiResponse.ok) {
        throw new Error("Failed to get recommendations.")
      }

      const data = await apiResponse.json()
      setResponse(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Oops!",
        description: "Something went wrong. Let me try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShowWelcome(true)
      setResponse(null)
      if (initialMessage) {
        setQuery(initialMessage)
        // Auto-submit if there's an initial message
        setTimeout(() => {
          if (initialMessage.trim()) {
            submitQuery(initialMessage)
          }
        }, 100)
      } else {
        setQuery("")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitQuery(query)
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
      <DialogContent className="glassmorphic-card sm:max-w-3xl max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-row items-center gap-4 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur pb-4">
          <Image
            src="/king-bud-default.png"
            alt="King Bud - Your AI Budtender"
            width={72}
            height={72}
            className="rounded-full object-cover border-2 border-green-500"
          />
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              King Bud <Cannabis className="h-6 w-6 text-green-500" />
            </DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300 mt-1">
              Your personal cannabis connoisseur
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {showWelcome && !isLoading && !response && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200">
                Hey there! 👋 Welcome to DankDeals! I'm King Bud, and I'm here to help you find the perfect strain for whatever vibe you're going for.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Just tell me what you're looking for - whether it's chilling after work, getting creative, or anything in between. I've got you covered!
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Let me think about that...</p>
            </div>
          )}

          {response && (
            <div className="space-y-4 animate-fadeIn">
              {/* Greeting */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-800 dark:text-gray-200">{response.greeting}</p>
              </div>

              {/* Personal Insight */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-800 dark:text-gray-200">{response.personalInsight}</p>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                {response.recommendations.map((rec, index) => {
                  const product = products.find((p) => p.id === rec.productId)
                  if (!product) return null
                  return (
                    <div key={rec.productId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-4">
                        <p className="text-gray-700 dark:text-gray-300 mb-3 italic">{rec.introduction}</p>
                        
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                              {product.name}
                              <span className="text-sm font-normal text-green-600 dark:text-green-400">
                                {product.category}
                              </span>
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                              {rec.whyItsGreat}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 bg-green-50 dark:bg-green-900/20 rounded p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Pro tip:</span> {rec.personalNote}
                          </p>
                        </div>

                        <Button
                          className="w-full mt-3 neumorphic-outset dark:neumorphic-outset-dark"
                          onClick={() => handleProductClick(product.id)}
                        >
                          View Details & Pricing
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Closing Message */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-gray-800 dark:text-gray-200">{response.closingMessage}</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur pt-4">
          <Textarea
            placeholder="Tell me what you're looking for... (e.g., 'something to help me relax but stay focused' or 'I want to get creative and energized')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[80px] bg-white/70 dark:bg-black/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="mt-3 w-full neumorphic-outset dark:neumorphic-outset-dark"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isLoading ? "Thinking..." : "Ask King Bud"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
