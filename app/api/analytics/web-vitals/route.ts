import { NextRequest, NextResponse } from 'next/server'
import { BigQuery } from '@google-cloud/bigquery'

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
})

interface WebVitalsData {
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    fcp: { good: 1.8, poor: 3.0 },
    lcp: { good: 2.5, poor: 4.0 },
    cls: { good: 0.1, poor: 0.25 },
    fid: { good: 100, poor: 300 },
    ttfb: { good: 800, poor: 1800 }
  }

  const threshold = thresholds[metric as keyof typeof thresholds]
  if (!threshold) return 'poor'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'

    // Convert timeRange to BigQuery date format
    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30
    }
    const days = daysMap[timeRange] || 7

    // Query BigQuery for Core Web Vitals data
    const query = `
      SELECT 
        metric_name,
        PERCENTILE_CONT(metric_value, 0.75) OVER (PARTITION BY metric_name) as p75_value
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
      WHERE 
        event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
        AND metric_name IN ('FCP', 'LCP', 'CLS', 'FID', 'TTFB')
        AND page_location LIKE '%dankdealsmn.com%'
      GROUP BY metric_name, metric_value
    `

    const [rows] = await bigquery.query(query)

    // Process results into expected format
    const webVitals: Partial<WebVitalsData> = {}
    
    rows.forEach((row: any) => {
      const metricName = row.metric_name.toLowerCase()
      const value = parseFloat(row.p75_value)
      
      switch (metricName) {
        case 'fcp':
          webVitals.fcp = { value: value / 1000, rating: getRating('fcp', value / 1000) }
          break
        case 'lcp':
          webVitals.lcp = { value: value / 1000, rating: getRating('lcp', value / 1000) }
          break
        case 'cls':
          webVitals.cls = { value, rating: getRating('cls', value) }
          break
        case 'fid':
          webVitals.fid = { value, rating: getRating('fid', value) }
          break
        case 'ttfb':
          webVitals.ttfb = { value, rating: getRating('ttfb', value) }
          break
      }
    })

    // Ensure all metrics are present with defaults if no data
    const defaultWebVitals: WebVitalsData = {
      fcp: webVitals.fcp || { value: 0, rating: 'poor' },
      lcp: webVitals.lcp || { value: 0, rating: 'poor' },
      cls: webVitals.cls || { value: 0, rating: 'poor' },
      fid: webVitals.fid || { value: 0, rating: 'poor' },
      ttfb: webVitals.ttfb || { value: 0, rating: 'poor' }
    }

    return NextResponse.json(defaultWebVitals)

  } catch (error) {
    console.error('Error fetching web vitals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch web vitals data' },
      { status: 500 }
    )
  }
}

// Mark route as dynamic since it uses request.url
export const dynamic = 'force-dynamic'
// Cache the response for 5 minutes
export const runtime = 'nodejs'
export const revalidate = 300 