'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, StarHalf, MessageSquare, ThumbsUp, Calendar, MapPin, Verified } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ReviewData {
  aggregateRating: {
    ratingValue: number
    reviewCount: number
    bestRating: number
    worstRating: number
  }
  reviews: Review[]
  platforms: {
    google: { rating: number; count: number }
    leafly: { rating: number; count: number }
    weedmaps: { rating: number; count: number }
  }
}

interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  platform: 'google' | 'leafly' | 'weedmaps' | 'internal'
  verified: boolean
  helpful: number
  location?: string
  productCategory?: string
}

export default function ReviewsPage() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setReviewData(data)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      setReviewData(null)
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = reviewData?.reviews.filter(review => {
    if (selectedRating && review.rating !== selectedRating) return false
    if (selectedPlatform !== 'all' && review.platform !== selectedPlatform) return false
    return true
  }) || []

  const renderStars = (rating: number, size = 'sm') => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className={cn("fill-yellow-400 text-yellow-400", size === 'lg' ? "h-6 w-6" : "h-4 w-4")} />
        ))}
        {hasHalfStar && (
          <StarHalf className={cn("fill-yellow-400 text-yellow-400", size === 'lg' ? "h-6 w-6" : "h-4 w-4")} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className={cn("text-gray-300", size === 'lg' ? "h-6 w-6" : "h-4 w-4")} />
        ))}
      </div>
    )
  }

  const getRatingDistribution = () => {
    if (!reviewData) return []
    
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = reviewData.reviews.filter(r => r.rating === rating).length
      const percentage = (count / reviewData.reviews.length) * 100
      return { rating, count, percentage }
    })
    
    return distribution
  }

  // Structured data for SEO
  const aggregateRatingSchema = reviewData ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "DankDealsMN Cannabis Delivery",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviewData.aggregateRating.ratingValue.toString(),
      "reviewCount": reviewData.aggregateRating.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviewData.reviews.slice(0, 10).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.content,
      "datePublished": review.date,
      "publisher": {
        "@type": "Organization",
        "name": review.platform
      }
    }))
  } : null

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      {aggregateRatingSchema && <JsonLd data={aggregateRatingSchema} />}
      
      <div className="min-h-screen bg-app-bg">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Customer Reviews & Ratings
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what Minneapolis customers are saying about our cannabis delivery service
              </p>
            </div>

            {/* Aggregate Rating Overview */}
            {reviewData && (
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Overall Rating */}
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-2">
                        {reviewData.aggregateRating.ratingValue}
                      </div>
                      {renderStars(reviewData.aggregateRating.ratingValue, 'lg')}
                      <p className="text-muted-foreground mt-2">
                        Based on {reviewData.aggregateRating.reviewCount} reviews
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      <h3 className="font-semibold mb-4">Rating Distribution</h3>
                      {getRatingDistribution().map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="w-3 text-sm">{rating}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Platform Ratings */}
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-4">Platform Ratings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Google</Badge>
                            {renderStars(reviewData.platforms.google.rating)}
                          </div>
                          <span className="text-sm font-medium">
                            {reviewData.platforms.google.rating} ({reviewData.platforms.google.count})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Leafly</Badge>
                            {renderStars(reviewData.platforms.leafly.rating)}
                          </div>
                          <span className="text-sm font-medium">
                            {reviewData.platforms.leafly.rating} ({reviewData.platforms.leafly.count})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Weedmaps</Badge>
                            {renderStars(reviewData.platforms.weedmaps.rating)}
                          </div>
                          <span className="text-sm font-medium">
                            {reviewData.platforms.weedmaps.rating} ({reviewData.platforms.weedmaps.count})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Reviews
                </CardTitle>
                <CardDescription>
                  Real feedback from verified customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex gap-2">
                    <Button
                      variant={selectedRating === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRating(null)}
                    >
                      All Ratings
                    </Button>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <Button
                        key={rating}
                        variant={selectedRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRating(rating)}
                        className="flex items-center gap-1"
                      >
                        {rating}
                        <Star className="h-3 w-3 fill-current" />
                      </Button>
                    ))}
                  </div>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPlatform === 'all' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPlatform('all')}
                    >
                      All Sources
                    </Button>
                    {['google', 'leafly', 'weedmaps', 'internal'].map(platform => (
                      <Button
                        key={platform}
                        variant={selectedPlatform === platform ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPlatform(platform)}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <Card key={review.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-primary">
                                {review.author.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{review.author}</h4>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Verified className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {review.location}
                                <span>•</span>
                                <Calendar className="h-3 w-3" />
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <Badge variant="outline" className="text-xs">
                              {review.platform}
                            </Badge>
                          </div>
                        </div>
                        
                        <h5 className="font-medium mb-2">{review.title}</h5>
                        <p className="text-muted-foreground mb-4">{review.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {review.productCategory && (
                              <Badge variant="secondary">{review.productCategory}</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredReviews.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews match your current filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Experience Our 5-Star Service
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join hundreds of satisfied customers who trust DankDealsMN for fast, 
                  reliable cannabis delivery in Minneapolis and the Twin Cities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/menu">
                      Browse Our Menu
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="sms:+16129301390?&body=Hi! I'd like to place an order.">
                      Text to Order: (612) 930-1390
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
} 