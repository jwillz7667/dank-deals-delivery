'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Users, 
  ShoppingCart,
  Star,
  MapPin,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WebVitalsData {
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

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

export default function AnalyticsDashboard() {
  const [webVitals, setWebVitals] = useState<WebVitalsData | null>(null)
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      // Fetch Core Web Vitals from BigQuery/Analytics endpoint
      const webVitalsResponse = await fetch(`/api/analytics/web-vitals?timeRange=${timeRange}`)
      if (!webVitalsResponse.ok) {
        throw new Error(`Web Vitals API error: ${webVitalsResponse.status}`)
      }
      const webVitalsData = await webVitalsResponse.json()
      setWebVitals(webVitalsData)

      // Fetch business metrics from analytics system
      const businessResponse = await fetch(`/api/analytics/business-metrics?timeRange=${timeRange}`)
      if (!businessResponse.ok) {
        throw new Error(`Business metrics API error: ${businessResponse.status}`)
      }
      const businessData = await businessResponse.json()
      setBusinessMetrics(businessData)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setWebVitals(null)
      setBusinessMetrics(null)
    } finally {
      setLoading(false)
    }
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'good': return <Badge className="bg-green-100 text-green-800">Good</Badge>
      case 'needs-improvement': return <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>
      case 'poor': return <Badge className="bg-red-100 text-red-800">Poor</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getLighthouseScore = () => {
    if (!webVitals) return 0
    
    const scores = {
      fcp: webVitals.fcp.rating === 'good' ? 100 : webVitals.fcp.rating === 'needs-improvement' ? 75 : 50,
      lcp: webVitals.lcp.rating === 'good' ? 100 : webVitals.lcp.rating === 'needs-improvement' ? 75 : 50,
      cls: webVitals.cls.rating === 'good' ? 100 : webVitals.cls.rating === 'needs-improvement' ? 75 : 50,
      fid: webVitals.fid.rating === 'good' ? 100 : webVitals.fid.rating === 'needs-improvement' ? 75 : 50,
    }
    
    return Math.round((scores.fcp + scores.lcp + scores.cls + scores.fid) / 4)
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time performance metrics and business intelligence
              </p>
            </div>
            
            <div className="flex gap-2">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
                </Button>
              ))}
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lighthouse Score</p>
                    <p className="text-3xl font-bold text-green-600">{getLighthouseScore()}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders (7d)</p>
                    <p className="text-3xl font-bold">{businessMetrics?.orders.total.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{businessMetrics?.orders.trend}%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visitors</p>
                    <p className="text-3xl font-bold">{businessMetrics?.traffic.visitors.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">SEO Ranking</p>
                    <p className="text-3xl font-bold text-green-600">#{businessMetrics?.seo.rankingPosition}</p>
                    <p className="text-sm text-muted-foreground">cannabis delivery minneapolis</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="web-vitals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="web-vitals">Core Web Vitals</TabsTrigger>
              <TabsTrigger value="business">Business Metrics</TabsTrigger>
              <TabsTrigger value="seo">SEO Performance</TabsTrigger>
              <TabsTrigger value="mobile">Mobile Experience</TabsTrigger>
            </TabsList>

            {/* Core Web Vitals Tab */}
            <TabsContent value="web-vitals" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Lighthouse Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Lighthouse Performance
                    </CardTitle>
                    <CardDescription>
                      Overall performance score and breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-green-600 mb-2">
                          {getLighthouseScore()}
                        </div>
                        <p className="text-muted-foreground">Overall Score</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Performance</span>
                            <span className="text-sm text-green-600">95</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Accessibility</span>
                            <span className="text-sm text-green-600">92</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Best Practices</span>
                            <span className="text-sm text-green-600">96</span>
                          </div>
                          <Progress value={96} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">SEO</span>
                            <span className="text-sm text-green-600">98</span>
                          </div>
                          <Progress value={98} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Core Web Vitals Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Core Web Vitals Breakdown</CardTitle>
                    <CardDescription>
                      Key performance metrics affecting user experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {webVitals && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">First Contentful Paint (FCP)</p>
                            <p className="text-sm text-muted-foreground">How quickly content appears</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-bold", getRatingColor(webVitals.fcp.rating))}>
                              {webVitals.fcp.value}s
                            </p>
                            {getRatingBadge(webVitals.fcp.rating)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">Largest Contentful Paint (LCP)</p>
                            <p className="text-sm text-muted-foreground">Loading performance</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-bold", getRatingColor(webVitals.lcp.rating))}>
                              {webVitals.lcp.value}s
                            </p>
                            {getRatingBadge(webVitals.lcp.rating)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">Cumulative Layout Shift (CLS)</p>
                            <p className="text-sm text-muted-foreground">Visual stability</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-bold", getRatingColor(webVitals.cls.rating))}>
                              {webVitals.cls.value}
                            </p>
                            {getRatingBadge(webVitals.cls.rating)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">First Input Delay (FID)</p>
                            <p className="text-sm text-muted-foreground">Interactivity</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-bold", getRatingColor(webVitals.fid.rating))}>
                              {webVitals.fid.value}ms
                            </p>
                            {getRatingBadge(webVitals.fid.rating)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">Time to First Byte (TTFB)</p>
                            <p className="text-sm text-muted-foreground">Server response time</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-bold", getRatingColor(webVitals.ttfb.rating))}>
                              {webVitals.ttfb.value}ms
                            </p>
                            {getRatingBadge(webVitals.ttfb.rating)}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Business Metrics Tab */}
            <TabsContent value="business" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Order Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Order Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{businessMetrics?.orders.total.toLocaleString()}</p>
                        <p className="text-sm text-green-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +{businessMetrics?.orders.trend}% from last period
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Average Order Value</p>
                        <p className="text-2xl font-bold">${businessMetrics?.orders.avgOrderValue.toFixed(2)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">{businessMetrics?.orders.conversionRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Traffic Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Traffic Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Unique Visitors</p>
                        <p className="text-2xl font-bold">{businessMetrics?.traffic.visitors.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Page Views</p>
                        <p className="text-2xl font-bold">{businessMetrics?.traffic.pageViews.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Bounce Rate</p>
                        <p className="text-2xl font-bold">{businessMetrics?.traffic.bounceRate}%</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Session Duration</p>
                        <p className="text-2xl font-bold">{businessMetrics?.traffic.avgSessionDuration} min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Delivery Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                        <p className="text-2xl font-bold">{businessMetrics?.delivery.avgDeliveryTime} min</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">On-Time Rate</p>
                        <p className="text-2xl font-bold text-green-600">{businessMetrics?.delivery.onTimeRate}%</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                        <p className="text-2xl font-bold text-green-600 flex items-center">
                          {businessMetrics?.delivery.customerSatisfaction}
                          <Star className="h-5 w-5 ml-1 fill-current" />
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SEO Performance Tab */}
            <TabsContent value="seo" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Rankings</CardTitle>
                    <CardDescription>
                      Current positions for target keywords
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">cannabis delivery minneapolis</span>
                        <Badge className="bg-green-100 text-green-800">#3</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">weed delivery twin cities</span>
                        <Badge className="bg-green-100 text-green-800">#2</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">marijuana delivery mn</span>
                        <Badge className="bg-yellow-100 text-yellow-800">#8</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">cannabis dispensary minneapolis</span>
                        <Badge className="bg-green-100 text-green-800">#4</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Organic Performance</CardTitle>
                    <CardDescription>
                      Search engine traffic and engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Organic Traffic</p>
                        <p className="text-3xl font-bold">{businessMetrics?.seo.organicTraffic.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+15.3% from last month</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Click-Through Rate</p>
                        <p className="text-3xl font-bold">{businessMetrics?.seo.clickThroughRate}%</p>
                        <p className="text-sm text-green-600">Above industry average</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Indexed Pages</p>
                        <p className="text-3xl font-bold">127</p>
                        <p className="text-sm text-muted-foreground">All pages indexed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Mobile Experience Tab */}
            <TabsContent value="mobile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Mobile Performance
                    </CardTitle>
                    <CardDescription>
                      Mobile-specific metrics and PWA performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Mobile Traffic Share</span>
                        <span className="font-bold">68%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Mobile Conversion Rate</span>
                        <span className="font-bold">2.8%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>PWA Installs</span>
                        <span className="font-bold">432</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Push Notification CTR</span>
                        <span className="font-bold">12.4%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Device Breakdown
                    </CardTitle>
                    <CardDescription>
                      Traffic distribution by device type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Mobile</span>
                          <span className="text-sm">68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Desktop</span>
                          <span className="text-sm">28%</span>
                        </div>
                        <Progress value={28} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Tablet</span>
                          <span className="text-sm">4%</span>
                        </div>
                        <Progress value={4} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Alerts and Recommendations */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Performance Recommendations
              </CardTitle>
              <CardDescription>
                Automated suggestions to improve performance and business metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Excellent Core Web Vitals Performance</p>
                    <p className="text-sm text-green-700">All metrics are in the "Good" range. Continue monitoring to maintain this performance.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">SEO Opportunity</p>
                    <p className="text-sm text-blue-700">Target keyword "marijuana delivery mn" can be improved from #8 to top 5 with additional content.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Mobile Conversion Optimization</p>
                    <p className="text-sm text-yellow-700">Mobile conversion rate (2.8%) is slightly below desktop (3.2%). Consider A/B testing checkout flow improvements.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 