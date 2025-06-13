import { products } from "@/lib/products"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import JsonLd from "@/components/json-ld"
import { createProductSlug } from "@/lib/utils"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata dynamically for each product page
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = products.find(p => createProductSlug(p.name) === slug)
  
  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found."
    }
  }

  const title = `${product.name} - Premium Cannabis | DankDeals`
  const description = product.metaDescription || product.description
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl]

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: images.map((img) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: product.imageAlt || product.name,
      })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images,
    },
  }
}

// Pre-render all product pages at build time
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: createProductSlug(product.name),
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = products.find(p => createProductSlug(p.name) === slug)

  if (!product) {
    notFound()
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl]

  // Product structured data for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImages,
    brand: {
      "@type": "Brand",
      name: "DankDeals"
    },
    offers: product.pricing && !product.soldOut ? product.pricing.map(price => ({
      "@type": "Offer",
      price: price.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      name: `${product.name} - ${price.weight}`,
      seller: {
        "@type": "Organization",
        name: "DankDeals.org"
      }
    })) : [{
      "@type": "Offer",
      availability: "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "DankDeals.org"
      }
    }],
    category: product.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <JsonLd data={productSchema} />
      <Header />
      <main className="pt-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 sm:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={productImages[0]}
                  alt={product.imageAlt || product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.soldOut && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                    SOLD OUT
                  </div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.slice(1).map((image, index) => (
                    <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} - View ${index + 2}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                <p className="text-xl text-green-600 dark:text-green-400 mt-2">{product.category}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Effects</h2>
                <p className="text-gray-700 dark:text-gray-300">{product.effects}</p>
              </div>

              {product.pricing && !product.soldOut && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pricing</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.pricing.map((price) => (
                      <div key={price.weight} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{price.weight}</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">${price.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-100 dark:bg-green-900/50 p-6 rounded-lg">
                {product.soldOut ? (
                  <>
                    <p className="font-semibold text-red-800 dark:text-red-200 text-lg">Currently Sold Out</p>
                    <p className="text-red-700 dark:text-red-300 mt-1">Check back soon or contact us for availability.</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-green-800 dark:text-green-200 text-lg">Ready to order?</p>
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      Text us to place your order for {product.name}.
                    </p>
                  </>
                )}
                <a href={`sms:+16129301390?&body=Hi! I'd like to order the ${encodeURIComponent(product.name)}.`}>
                  <Button 
                    className="w-full mt-4 neumorphic-outset dark:neumorphic-outset-dark" 
                    size="lg"
                    disabled={product.soldOut}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Order Now via Text
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 