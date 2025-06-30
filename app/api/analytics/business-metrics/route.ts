import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, orderItems, products } from '@/lib/db/schema'
import { eq, gte, sql, and, desc } from 'drizzle-orm'

interface BusinessMetrics {
  orders: {
    total: number
    trend: number
    avgOrderValue: number
    conversionRate: number
  }
  traffic: {
    visitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: number
  }
  delivery: {
    avgDeliveryTime: number
    onTimeRate: number
    customerSatisfaction: number
  }
  seo: {
    rankingPosition: number
    organicTraffic: number
    clickThroughRate: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'

    // Convert timeRange to days
    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30
    }
    const days = daysMap[timeRange] || 7

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const previousStartDate = new Date()
    previousStartDate.setDate(startDate.getDate() - days)

    // Fetch order metrics from database
    const [currentOrders] = await db
      .select({
        total: sql<number>`count(*)`,
        totalValue: sql<number>`sum(CAST(${orders.total} as DECIMAL(10,2)))`,
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, startDate),
          eq(orders.status, 'delivered')
        )
      )

    const [previousOrders] = await db
      .select({
        total: sql<number>`count(*)`,
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, previousStartDate),
          eq(orders.status, 'delivered')
        )
      )

    // Calculate metrics
    const orderTotal = currentOrders?.total || 0
    const previousOrderTotal = previousOrders?.total || 0
    const orderTrend = previousOrderTotal > 0 
      ? ((orderTotal - previousOrderTotal) / previousOrderTotal) * 100 
      : 0

    const avgOrderValue = orderTotal > 0 
      ? (currentOrders?.totalValue || 0) / orderTotal 
      : 0

    // Fetch delivery performance metrics
    const deliveryMetrics = await db
      .select({
        avgTime: sql<number>`avg(CASE WHEN ${orders.status} = 'delivered' THEN 
          EXTRACT(EPOCH FROM (updated_at - created_at))/60 ELSE NULL END)`,
        onTimeCount: sql<number>`count(CASE WHEN ${orders.status} = 'delivered' 
          AND EXTRACT(EPOCH FROM (updated_at - created_at))/60 <= 45 THEN 1 END)`,
        totalDelivered: sql<number>`count(CASE WHEN ${orders.status} = 'delivered' THEN 1 END)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, startDate))

    const avgDeliveryTime = Math.round(deliveryMetrics[0]?.avgTime || 0)
    const onTimeRate = deliveryMetrics[0]?.totalDelivered > 0
      ? (deliveryMetrics[0]?.onTimeCount / deliveryMetrics[0]?.totalDelivered) * 100
      : 0

    // Fetch reviews for customer satisfaction
    const avgRatingQuery = await db
      .select({
        avgRating: sql<number>`avg(rating)`,
      })
      .from(sql`reviews`)
      .where(sql`created_at >= ${startDate}`)

    const customerSatisfaction = avgRatingQuery[0]?.avgRating || 0

    // Fetch traffic metrics from Plausible API
    const plausibleResponse = await fetch(
      `https://pl.dankdealsmn.com/api/v1/stats/aggregate?site_id=dankdealsmn.com&period=${timeRange}&metrics=visitors,pageviews,bounce_rate,visit_duration`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
        },
      }
    )

    let trafficMetrics = {
      visitors: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
    }

    if (plausibleResponse.ok) {
      const plausibleData = await plausibleResponse.json()
      trafficMetrics = {
        visitors: plausibleData.results.visitors?.value || 0,
        pageViews: plausibleData.results.pageviews?.value || 0,
        bounceRate: plausibleData.results.bounce_rate?.value || 0,
        avgSessionDuration: (plausibleData.results.visit_duration?.value || 0) / 60, // Convert to minutes
      }
    }

    // Fetch SEO metrics from Google Search Console API
    const searchConsoleResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fdankdealsmn.com%2F/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_SEARCH_CONSOLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          dimensions: ['query'],
          searchType: 'web',
          rowLimit: 1000,
        }),
      }
    )

    let seoMetrics = {
      rankingPosition: 0,
      organicTraffic: 0,
      clickThroughRate: 0,
    }

    if (searchConsoleResponse.ok) {
      const searchData = await searchConsoleResponse.json()
      
      // Find "cannabis delivery minneapolis" ranking
      const targetQuery = searchData.rows?.find((row: any) => 
        row.keys[0].toLowerCase().includes('cannabis delivery minneapolis')
      )

      seoMetrics = {
        rankingPosition: Math.round(targetQuery?.position || 0),
        organicTraffic: searchData.rows?.reduce((sum: number, row: any) => sum + row.clicks, 0) || 0,
        clickThroughRate: searchData.rows?.length > 0 
          ? (searchData.rows.reduce((sum: number, row: any) => sum + row.ctr, 0) / searchData.rows.length) * 100
          : 0,
      }
    }

    // Calculate conversion rate (orders / visitors)
    const conversionRate = trafficMetrics.visitors > 0 
      ? (orderTotal / trafficMetrics.visitors) * 100 
      : 0

    const businessMetrics: BusinessMetrics = {
      orders: {
        total: orderTotal,
        trend: orderTrend,
        avgOrderValue,
        conversionRate,
      },
      traffic: trafficMetrics,
      delivery: {
        avgDeliveryTime,
        onTimeRate,
        customerSatisfaction,
      },
      seo: seoMetrics,
    }

    return NextResponse.json(businessMetrics)

  } catch (error) {
    console.error('Error fetching business metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business metrics' },
      { status: 500 }
    )
  }
}

// Mark route as dynamic since it uses request.url
export const dynamic = 'force-dynamic'
// Cache the response for 10 minutes
export const runtime = 'nodejs'
export const revalidate = 600 