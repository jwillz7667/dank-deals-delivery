import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql, eq, desc, count, avg } from 'drizzle-orm'
import { reviews } from '@/lib/db/schema'

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

async function fetchGoogleReviews(): Promise<Review[]> {
  try {
    // Google My Business API call
    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${process.env.GOOGLE_MY_BUSINESS_ACCOUNT}/locations/${process.env.GOOGLE_MY_BUSINESS_LOCATION}/reviews`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_MY_BUSINESS_TOKEN}`,
        },
      }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.reviews?.map((review: any) => ({
      id: review.reviewId,
      author: review.reviewer?.displayName || 'Anonymous',
      rating: review.starRating,
      title: review.comment?.substring(0, 100) || '',
      content: review.comment || '',
      date: review.createTime,
      platform: 'google' as const,
      verified: true,
      helpful: 0,
      location: 'Minneapolis, MN',
    })) || []
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return []
  }
}

async function fetchLeaflyReviews(): Promise<Review[]> {
  try {
    // Leafly API call (if available)
    const response = await fetch(
      `https://web-platform.leafly.com/api/strain-reviews/dispensary/${process.env.LEAFLY_DISPENSARY_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LEAFLY_API_KEY}`,
        },
      }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.reviews?.map((review: any) => ({
      id: review.id,
      author: review.user?.username || 'Anonymous',
      rating: review.rating,
      title: review.title || '',
      content: review.body || '',
      date: review.created_at,
      platform: 'leafly' as const,
      verified: review.verified || false,
      helpful: review.helpful_count || 0,
      location: review.location || 'Minneapolis, MN',
      productCategory: review.strain?.category || undefined,
    })) || []
  } catch (error) {
    console.error('Error fetching Leafly reviews:', error)
    return []
  }
}

async function fetchWeedmapsReviews(): Promise<Review[]> {
  try {
    // Weedmaps API call (if available)
    const response = await fetch(
      `https://api.weedmaps.com/discovery/v1/listings/${process.env.WEEDMAPS_LISTING_ID}/reviews`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WEEDMAPS_API_KEY}`,
        },
      }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.data?.reviews?.map((review: any) => ({
      id: review.id,
      author: review.author?.username || 'Anonymous',
      rating: review.rating,
      title: review.title || '',
      content: review.body || '',
      date: review.created_at,
      platform: 'weedmaps' as const,
      verified: review.verified || false,
      helpful: review.helpful_count || 0,
      location: 'Twin Cities, MN',
    })) || []
  } catch (error) {
    console.error('Error fetching Weedmaps reviews:', error)
    return []
  }
}

async function fetchInternalReviews(): Promise<Review[]> {
  try {
    // Fetch from internal reviews table
    const internalReviews = await db
      .select({
        id: reviews.id,
        author: reviews.reviewerName,
        rating: reviews.rating,
        title: sql<string>`''`, // No title field in current schema
        content: reviews.reviewText,
        date: reviews.date,
        verified: reviews.verified,
        helpful: sql<number>`0`, // No helpful count in current schema
        location: sql<string>`'Minneapolis, MN'`, // Default location
        productCategory: sql<string>`NULL`,
      })
      .from(reviews)
      .orderBy(desc(reviews.date))
      .limit(50)

    return internalReviews.map(review => ({
      id: review.id.toString(),
      author: review.author,
      rating: review.rating,
      title: review.title || '',
      content: review.content || '',
      date: review.date.toISOString(),
      verified: review.verified,
      helpful: review.helpful,
      location: review.location,
      productCategory: review.productCategory,
      platform: 'internal' as const,
    }))
  } catch (error) {
    console.error('Error fetching internal reviews:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fetch reviews from all platforms in parallel
    const [googleReviews, leaflyReviews, weedmapsReviews, internalReviews] = await Promise.all([
      fetchGoogleReviews(),
      fetchLeaflyReviews(),
      fetchWeedmapsReviews(),
      fetchInternalReviews(),
    ])

    // Combine all reviews
    const allReviews = [
      ...googleReviews,
      ...leaflyReviews,
      ...weedmapsReviews,
      ...internalReviews,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate platform-specific aggregates
    const platformAggregates = {
      google: {
        rating: googleReviews.length > 0 
          ? googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length 
          : 0,
        count: googleReviews.length,
      },
      leafly: {
        rating: leaflyReviews.length > 0 
          ? leaflyReviews.reduce((sum, r) => sum + r.rating, 0) / leaflyReviews.length 
          : 0,
        count: leaflyReviews.length,
      },
      weedmaps: {
        rating: weedmapsReviews.length > 0 
          ? weedmapsReviews.reduce((sum, r) => sum + r.rating, 0) / weedmapsReviews.length 
          : 0,
        count: weedmapsReviews.length,
      },
    }

    // Calculate overall aggregate rating
    const totalReviews = allReviews.length
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0

    const minRating = allReviews.length > 0 ? Math.min(...allReviews.map(r => r.rating)) : 1
    const maxRating = allReviews.length > 0 ? Math.max(...allReviews.map(r => r.rating)) : 5

    const reviewData: ReviewData = {
      aggregateRating: {
        ratingValue: Math.round(averageRating * 10) / 10,
        reviewCount: totalReviews,
        bestRating: maxRating,
        worstRating: minRating,
      },
      reviews: allReviews.slice(0, 20), // Return latest 20 reviews
      platforms: platformAggregates,
    }

    return NextResponse.json(reviewData)

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST endpoint to manually add internal reviews
export async function POST(request: NextRequest) {
  try {
    const review = await request.json()

    // Validate required fields
    if (!review.author || !review.rating || !review.content) {
      return NextResponse.json(
        { error: 'Missing required fields: author, rating, content' },
        { status: 400 }
      )
    }

         // Insert into database
     const result = await db
       .insert(reviews)
       .values({
         productId: review.productId || 'general',
         source: 'internal',
         reviewerName: review.author,
         rating: review.rating,
         reviewText: review.content,
         date: new Date(),
         verified: review.verified || false,
       })
       .returning({ id: reviews.id })

    return NextResponse.json({
      success: true,
      id: result[0].id,
      message: 'Review added successfully',
    })

  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    )
  }
}

// Webhook endpoint for external review platforms
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.REVIEWS_WEBHOOK_TOKEN

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Process incoming webhook from review platforms
    if (body.platform === 'google' || body.platform === 'leafly' || body.platform === 'weedmaps') {
      // Store the review in the existing reviews table
      await db
        .insert(reviews)
        .values({
          productId: body.review.productId || 'general',
          source: body.platform,
          reviewerName: body.review.author,
          rating: body.review.rating,
          reviewText: body.review.content,
          date: new Date(body.review.date),
          verified: body.review.verified || false,
        })

      return NextResponse.json({ message: 'Review webhook processed successfully' })
    }

    return NextResponse.json({ error: 'Unknown platform' }, { status: 400 })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Cache responses for 5 minutes
export const runtime = 'nodejs'
export const revalidate = 300 