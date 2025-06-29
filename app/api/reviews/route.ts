import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews, products } from '@/lib/db/schema';
import { eq, and, desc, count, avg, sum, sql } from 'drizzle-orm';
import { z } from 'zod';

// Review schema
const reviewSchema = z.object({
  productId: z.string(),
  source: z.enum(['leafly', 'google', 'internal']),
  rating: z.number().min(1).max(5),
  reviewerName: z.string(),
  reviewText: z.string().optional(),
  date: z.string().datetime(),
  verified: z.boolean().default(false),
});

const bulkReviewSchema = z.object({
  reviews: z.array(reviewSchema),
});

// GET endpoint to fetch reviews and aggregate ratings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const source = searchParams.get('source');

    // Build query conditions
    const conditions = [];
    if (productId) {
      conditions.push(eq(reviews.productId, productId));
    }
    if (source) {
      conditions.push(eq(reviews.source, source));
    }

    // Fetch reviews
    const reviewsQuery = db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.date));

    const reviewsList = conditions.length > 0 
      ? await reviewsQuery.where(and(...conditions))
      : await reviewsQuery;

    // Calculate aggregate ratings
    const aggregatesQuery = db
      .select({
        productId: reviews.productId,
        totalReviews: count(reviews.id),
        averageRating: avg(reviews.rating),
        fiveStar: sum(sql`CASE WHEN ${reviews.rating} = 5 THEN 1 ELSE 0 END`),
        fourStar: sum(sql`CASE WHEN ${reviews.rating} = 4 THEN 1 ELSE 0 END`),
        threeStar: sum(sql`CASE WHEN ${reviews.rating} = 3 THEN 1 ELSE 0 END`),
        twoStar: sum(sql`CASE WHEN ${reviews.rating} = 2 THEN 1 ELSE 0 END`),
        oneStar: sum(sql`CASE WHEN ${reviews.rating} = 1 THEN 1 ELSE 0 END`),
      })
      .from(reviews)
      .groupBy(reviews.productId);

    const aggregates = productId 
      ? await aggregatesQuery.where(eq(reviews.productId, productId))
      : await aggregatesQuery;

    return NextResponse.json({
      reviews: reviewsList,
      aggregates: aggregates.map((agg: any) => ({
        productId: agg.productId,
        totalReviews: Number(agg.totalReviews),
        averageRating: agg.averageRating ? parseFloat(Number(agg.averageRating).toFixed(2)) : 0,
        distribution: {
          5: Number(agg.fiveStar || 0),
          4: Number(agg.fourStar || 0),
          3: Number(agg.threeStar || 0),
          2: Number(agg.twoStar || 0),
          1: Number(agg.oneStar || 0),
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST endpoint to add reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = bulkReviewSchema.parse(body);

    const results = [];
    
    for (const review of validatedData.reviews) {
      try {
        const result = await db
          .insert(reviews)
          .values({
            productId: review.productId,
            source: review.source,
            rating: review.rating,
            reviewerName: review.reviewerName,
            reviewText: review.reviewText || null,
            date: new Date(review.date),
            verified: review.verified,
          })
          .returning({ id: reviews.id });
          
        results.push({ success: true, id: result[0].id });
      } catch (error) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    // Update product ratings cache
    await updateProductRatingsCache();

    return NextResponse.json({
      message: 'Reviews processed',
      results,
    });
  } catch (error) {
    console.error('Error adding reviews:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add reviews' },
      { status: 500 }
    );
  }
}

// Helper function to update product ratings cache
async function updateProductRatingsCache() {
  try {
    // Get all product aggregates
    const aggregates = await db
      .select({
        productId: reviews.productId,
        reviewCount: count(reviews.id),
        averageRating: avg(reviews.rating),
      })
      .from(reviews)
      .groupBy(reviews.productId);

    // Update products table with aggregate data
    for (const agg of aggregates) {
      await db
        .update(products)
        .set({
          rating: agg.averageRating ? parseFloat(Number(agg.averageRating).toFixed(2)) : 0,
          reviewCount: Number(agg.reviewCount),
        })
        .where(eq(products.id, agg.productId));
    }
  } catch (error) {
    console.error('Error updating product ratings cache:', error);
  }
}

// Webhook endpoint for external review sources
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVIEWS_WEBHOOK_TOKEN;

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Process webhook data based on source
    if (body.source === 'leafly') {
      // Transform Leafly data format
      const reviews = body.reviews.map((review: any) => ({
        productId: review.product_slug,
        source: 'leafly',
        rating: review.stars,
        reviewerName: review.username,
        reviewText: review.comment,
        date: new Date(review.created_at).toISOString(),
        verified: true,
      }));

      // Use the POST handler logic
      const validatedData = bulkReviewSchema.parse({ reviews });
      // ... process reviews
    }

    return NextResponse.json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 