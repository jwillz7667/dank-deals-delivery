import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DankIcon } from '@/lib/icons'
import { getAllPosts, getFeaturedPosts, CONTENT_PILLARS } from '@/lib/mdx'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'Cannabis Blog & Education | Dank Deals MN',
  description: 'Learn about cannabis strains, effects, delivery tips, and Minneapolis cannabis culture. Expert guides and product reviews.',
  keywords: 'cannabis blog minneapolis, marijuana education mn, weed strain reviews, cannabis delivery tips',
  openGraph: {
    title: 'Cannabis Blog & Education | Dank Deals MN',
    description: 'Your trusted source for cannabis education in Minneapolis',
    type: 'website',
    images: ['/og-blog.png'],
  },
}

export default async function BlogPage() {
  const allPosts = await getAllPosts()
  const featuredPosts = await getFeaturedPosts(3)

  // Group posts by category
  const postsByCategory = allPosts.reduce((acc, post) => {
    const category = post.category
    if (!acc[category]) acc[category] = []
    acc[category].push(post)
    return acc
  }, {} as Record<string, typeof allPosts>)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://dankdealsmn.com' },
    { name: 'Blog', url: 'https://dankdealsmn.com/blog' },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cannabis Education & News
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted source for cannabis education, product reviews, and Minneapolis delivery insights
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <DankIcon name="star" size={24} className="text-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{getCategoryName(post.category)}</Badge>
                      <span className="text-sm text-muted-foreground">{post.readingTime}</span>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <DankIcon name="arrowRight" size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Content Pillars */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(CONTENT_PILLARS).map(([key, pillar]) => (
              <Link
                key={key}
                href={`/blog/category/${key}`}
                className="p-4 text-center rounded-lg border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <DankIcon name="cannabis" size={32} className="mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {postsByCategory[key]?.length || 0} articles
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Posts by Category */}
        {Object.entries(postsByCategory).map(([category, posts]) => (
          <section key={category} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {getCategoryName(category)}
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href={`/blog/category/${category}`}>
                  View All
                  <DankIcon name="arrowRight" size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post) => (
                <Card key={post.slug} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">{post.readingTime}</span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm text-muted-foreground">
                      By {post.author} • {new Date(post.date).toLocaleDateString()}
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {/* Newsletter CTA */}
        <section className="mt-16 p-8 bg-primary/5 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest cannabis news, exclusive deals, and expert tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border bg-background"
            />
            <Button size="lg">
              Subscribe
              <DankIcon name="email" size={16} className="ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}

function getCategoryName(category: string): string {
  return CONTENT_PILLARS[category as keyof typeof CONTENT_PILLARS]?.title || category
} 