import { Handler } from '@netlify/functions'
import { BigQuery } from '@google-cloud/bigquery'

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE, // Path to service account JSON
})

const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET || 'web_analytics')
const table = dataset.table(process.env.BIGQUERY_TABLE || 'web_vitals')

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
  url: string
  timestamp: string
  userAgent: string
  effectiveType?: string
  sessionId: string
}

export const handler: Handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const metrics: WebVitalMetric[] = JSON.parse(event.body || '[]')
    
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid metrics data' }),
      }
    }

    // Transform metrics for BigQuery
    const rows = metrics.map(metric => ({
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      metric_id: metric.id,
      navigation_type: metric.navigationType,
      page_url: metric.url,
      timestamp: metric.timestamp,
      user_agent: metric.userAgent,
      effective_connection_type: metric.effectiveType || 'unknown',
      session_id: metric.sessionId,
      date: new Date(metric.timestamp).toISOString().split('T')[0],
      hour: new Date(metric.timestamp).getHours(),
    }))

    // Insert rows into BigQuery
    await table.insert(rows, {
      skipInvalidRows: true,
      ignoreUnknownValues: true,
    })

    // Also calculate and store aggregates
    await updateAggregates(metrics)

    console.log(`Successfully inserted ${rows.length} web vitals metrics`)

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        metricsProcessed: rows.length 
      }),
    }
  } catch (error) {
    console.error('Error processing web vitals:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    }
  }
}

// Update aggregate tables for faster querying
async function updateAggregates(metrics: WebVitalMetric[]) {
  const aggregateTable = dataset.table(process.env.BIGQUERY_AGGREGATE_TABLE || 'web_vitals_aggregates')
  
  // Group metrics by page and date
  const aggregates = new Map<string, any>()
  
  metrics.forEach(metric => {
    const date = new Date(metric.timestamp).toISOString().split('T')[0]
    const key = `${metric.url}|${date}|${metric.name}`
    
    if (!aggregates.has(key)) {
      aggregates.set(key, {
        page_url: metric.url,
        date: date,
        metric_name: metric.name,
        values: [],
        ratings: { good: 0, needs_improvement: 0, poor: 0 },
      })
    }
    
    const agg = aggregates.get(key)
    agg.values.push(metric.value)
    agg.ratings[metric.rating.replace('-', '_')]++
  })
  
  // Calculate percentiles and insert
  const rows = Array.from(aggregates.values()).map(agg => {
    const values = agg.values.sort((a: number, b: number) => a - b)
    const p75Index = Math.floor(values.length * 0.75)
    const p90Index = Math.floor(values.length * 0.90)
    const p99Index = Math.floor(values.length * 0.99)
    
    return {
      page_url: agg.page_url,
      date: agg.date,
      metric_name: agg.metric_name,
      sample_count: values.length,
      median_value: values[Math.floor(values.length / 2)],
      p75_value: values[p75Index],
      p90_value: values[p90Index],
      p99_value: values[p99Index],
      min_value: Math.min(...values),
      max_value: Math.max(...values),
      good_count: agg.ratings.good,
      needs_improvement_count: agg.ratings.needs_improvement,
      poor_count: agg.ratings.poor,
      timestamp: new Date().toISOString(),
    }
  })
  
  if (rows.length > 0) {
    await aggregateTable.insert(rows, {
      skipInvalidRows: true,
      ignoreUnknownValues: true,
    })
  }
}

// Schema for BigQuery tables (for reference)
export const webVitalsSchema = [
  { name: 'metric_name', type: 'STRING', mode: 'REQUIRED' },
  { name: 'metric_value', type: 'FLOAT64', mode: 'REQUIRED' },
  { name: 'metric_rating', type: 'STRING', mode: 'REQUIRED' },
  { name: 'metric_delta', type: 'FLOAT64', mode: 'NULLABLE' },
  { name: 'metric_id', type: 'STRING', mode: 'REQUIRED' },
  { name: 'navigation_type', type: 'STRING', mode: 'NULLABLE' },
  { name: 'page_url', type: 'STRING', mode: 'REQUIRED' },
  { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
  { name: 'user_agent', type: 'STRING', mode: 'NULLABLE' },
  { name: 'effective_connection_type', type: 'STRING', mode: 'NULLABLE' },
  { name: 'session_id', type: 'STRING', mode: 'REQUIRED' },
  { name: 'date', type: 'DATE', mode: 'REQUIRED' },
  { name: 'hour', type: 'INT64', mode: 'REQUIRED' },
]

export const aggregateSchema = [
  { name: 'page_url', type: 'STRING', mode: 'REQUIRED' },
  { name: 'date', type: 'DATE', mode: 'REQUIRED' },
  { name: 'metric_name', type: 'STRING', mode: 'REQUIRED' },
  { name: 'sample_count', type: 'INT64', mode: 'REQUIRED' },
  { name: 'median_value', type: 'FLOAT64', mode: 'REQUIRED' },
  { name: 'p75_value', type: 'FLOAT64', mode: 'REQUIRED' },
  { name: 'p90_value', type: 'FLOAT64', mode: 'REQUIRED' },
  { name: 'p99_value', type: 'FLOAT64', mode: 'REQUIRED' },
  { name: 'min_value', type: 'FLOAT64', mode: 'REQUIRED' },
  { name: 'max_value', type: 'FLOAT64', mode: 'REQUIRED' },
  { name: 'good_count', type: 'INT64', mode: 'REQUIRED' },
  { name: 'needs_improvement_count', type: 'INT64', mode: 'REQUIRED' },
  { name: 'poor_count', type: 'INT64', mode: 'REQUIRED' },
  { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
] 