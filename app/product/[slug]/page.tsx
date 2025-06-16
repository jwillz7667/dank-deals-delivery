"use client"

import { products } from "@/lib/products"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MessageSquare, ShoppingCart, Plus, Minus } from "lucide-react"
import JsonLd from "@/components/json-ld"
import { createProductSlug } from "@/lib/utils"
import ProductReviews from "@/components/product-reviews"
import ImageModal from "@/components/modals/image-modal"
import CartModal from "@/components/modals/cart-modal"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const product = products.find(p => createProductSlug(p.name) === slug)
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedPricing, setSelectedPricing] = useState<{weight: string, price: number} | null>(null)
  const [quantity, setQuantity] = useState(1)

  const { addToCart, cart } = useCart()

  useEffect(() => {
    if (product?.pricing && product.pricing.length > 0) {
      setSelectedPricing(product.pricing[0])
    }
  }, [product])

  if (!product) {
    notFound()
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl]

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setIsImageModalOpen(true)
  }

  const handleAddToCart = async () => {
    if (!selectedPricing) {
      toast.error('Please select a size first');
      return;
    }

    try {
      await addToCart(
        `${product.name}-${selectedPricing.weight}`,
        `${product.name} (${selectedPricing.weight})`,
        selectedPricing.price,
        quantity
      )
      
      setQuantity(1) // Reset quantity after adding
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Error handling is done in the addToCart function
    }
  }

  const handleQuickOrder = () => {
    if (!selectedPricing) {
      // Fallback to simple text order
      const message = `Hi! I'd like to order the ${product.name}.`
      window.open(`sms:+16129301390?&body=${encodeURIComponent(message)}`, '_self')
      return
    }

    const message = `Hi! I'd like to order:\n\n${product.name} (${selectedPricing.weight}) - $${selectedPricing.price.toFixed(2)}\nQuantity: ${quantity}\nTotal: $${(selectedPricing.price * quantity).toFixed(2)}\n\nPlease let me know the next steps for delivery. Thank you!`
    window.open(`sms:+16129301390?&body=${encodeURIComponent(message)}`, '_self')
  }

  // Calculate actual aggregate rating from reviews
  const calculateAggregateRating = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return null
    }
    
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / product.reviews.length
    
    return {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: product.reviews.length.toString(),
      bestRating: "5",
      worstRating: "1"
    }
  }

  // Product structured data for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImages,
    // Enhanced brand information
    brand: {
      "@type": "Brand",
      name: product.brand || "DankDeals"
    },
    // Manufacturer information
    manufacturer: {
      "@type": "Organization",
      name: product.manufacturer || "DankDeals"
    },
    // Product identifiers for better SEO
    ...(product.sku && { sku: product.sku }),
    ...(product.gtin && { gtin: product.gtin }),
    ...(product.mpn && { mpn: product.mpn }),
    
    // Enhanced category using Schema.org format
    category: {
      "@type": "ProductCategory",
      name: product.category,
      url: `https://dankdealsmn.com/menu?category=${product.category.toLowerCase()}`
    },
    
    // Additional product properties specific to cannabis
    additionalProperty: [
      ...(product.thcContent ? [{
        "@type": "PropertyValue",
        name: "THC Content",
        value: product.thcContent
      }] : []),
      ...(product.cbdContent ? [{
        "@type": "PropertyValue",
        name: "CBD Content", 
        value: product.cbdContent
      }] : []),
      ...(product.strainType ? [{
        "@type": "PropertyValue",
        name: "Strain Type",
        value: product.strainType
      }] : []),
      {
        "@type": "PropertyValue",
        name: "Effects",
        value: product.effects
      }
    ],
    
    // Enhanced offers with Google best practices
    offers: product.pricing && !product.soldOut ? product.pricing.map(price => ({
      "@type": "Offer",
      price: price.price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: `https://schema.org/${product.condition || 'New'}Condition`,
      url: `https://dankdealsmn.com/product/${createProductSlug(product.name)}`,
      priceValidUntil: "2024-12-31", // Set price validity date
      name: `${product.name} - ${price.weight}`,
      description: `${product.description} Available in ${price.weight} size.`,
      seller: {
        "@type": "Organization",
        name: "DankDealsMN.com",
        url: "https://dankdealsmn.com",
        logo: "https://dankdealsmn.com/logo.png",
        telephone: "+1-612-930-1390",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Minneapolis",
          addressRegion: "MN",
          addressCountry: "US"
        }
      },
      // Delivery/shipping information
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "HUR"
          },
          transitTime: {
            "@type": "QuantitativeValue", 
            minValue: 0.5,
            maxValue: 2,
            unitCode: "HUR"
          }
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
          addressRegion: "MN"
        }
      },
      // Return policy
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnInStore",
        returnFees: "https://schema.org/FreeReturn"
      }
    })) : [{
      "@type": "Offer",
      availability: "https://schema.org/OutOfStock",
      itemCondition: `https://schema.org/${product.condition || 'New'}Condition`,
      url: `https://dankdealsmn.com/product/${createProductSlug(product.name)}`,
      seller: {
        "@type": "Organization",
        name: "DankDealsMN.com",
        url: "https://dankdealsmn.com",
        logo: "https://dankdealsmn.com/logo.png"
      }
    }],
    
    // Reviews and ratings
    ...(product.reviews && product.reviews.length > 0 && {
      review: product.reviews.map(review => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating.toString(),
          bestRating: "5",
          worstRating: "1"
        },
        author: {
          "@type": "Person",
          name: review.author
        },
        datePublished: review.date,
        reviewBody: review.comment
      })),
      aggregateRating: calculateAggregateRating()
    })
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
              <div className="relative h-96 sm:h-[500px] rounded-lg overflow-hidden cursor-pointer group">
                <Image
                  src={productImages[0]}
                  alt={product.imageAlt || product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onClick={() => handleImageClick(0)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-black/90 rounded-full p-3">
                    <Plus className="h-6 w-6 text-gray-900 dark:text-white" />
                  </div>
                </div>
                {product.soldOut && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                    SOLD OUT
                  </div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.slice(1).map((image, index) => (
                    <div 
                      key={index} 
                      className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(index + 1)}
                    >
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Select Size & Pricing</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {product.pricing.map((price) => (
                      <button
                        key={price.weight}
                        onClick={() => setSelectedPricing(price)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          selectedPricing?.weight === price.weight
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/50'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{price.weight}</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">${price.price}</div>
                      </button>
                    ))}
                  </div>

                  {selectedPricing && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600 dark:text-green-400">
                          ${(selectedPricing.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {product.pricing && !product.soldOut && selectedPricing && (
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full neumorphic-outset dark:neumorphic-outset-dark" 
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart - ${(selectedPricing.price * quantity).toFixed(2)}
                  </Button>
                )}

                <div className="bg-green-100 dark:bg-green-900/50 rounded-lg p-4">
                  <Button 
                    onClick={handleQuickOrder}
                    variant="outline"
                    className="w-full" 
                    size="lg" 
                    disabled={product.soldOut}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {product.soldOut ? "Currently Unavailable" : "Quick Order via Text"}
                  </Button>
                </div>
              </div>

              {cart && cart.itemCount > 0 && (
                <Button 
                  onClick={() => setIsCartModalOpen(true)}
                  variant="secondary"
                  className="w-full" 
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  View Cart ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
                </Button>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-8 sm:mt-12 glassmorphic-card p-6 sm:p-8">
              <ProductReviews reviews={product.reviews} />
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Modals */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={productImages}
        currentIndex={currentImageIndex}
        productName={product.name}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </div>
  )
} 