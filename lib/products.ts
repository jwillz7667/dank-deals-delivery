export interface WeightPrice {
  weight: string
  size: string // Alias for weight for backwards compatibility
  price: number
}

export interface Review {
  id: number
  author: string
  rating: number
  comment: string
  date: string
}

export interface Product {
  id: number
  name: string
  category: "Flower" | "Edibles" | "Vapes"
  description: string
  effects: string
  imageUrl: string
  images?: string[] // Array of additional images for gallery
  imageAlt?: string // Alt text for SEO
  metaDescription?: string // Meta description for SEO
  pricing?: WeightPrice[]
  soldOut?: boolean
  reviews?: Review[]
  // Enhanced fields for better structured data
  sku?: string // Stock Keeping Unit
  gtin?: string // Global Trade Item Number (UPC/EAN)
  mpn?: string // Manufacturer Part Number
  condition?: "New" | "Used" | "Refurbished" // Product condition
  brand?: string // Product brand
  manufacturer?: string // Manufacturer name
  model?: string // Product model
  color?: string // Product color
  material?: string // Product material
  thcContent?: string // THC percentage for cannabis products
  cbdContent?: string // CBD percentage for cannabis products
  thc?: string // Alias for thcContent for backwards compatibility
  cbd?: string // Alias for cbdContent for backwards compatibility
  strainType?: "Indica" | "Sativa" | "Hybrid" // Cannabis strain type
  weight?: string // Physical weight of product
  dimensions?: string // Product dimensions
  // Additional structured data fields for Google compliance
  isbn?: string // ISBN for books
  productionCountry?: string // Country where product was produced
  targetAudience?: string // Target audience description
  awards?: string[] // Any awards or certifications
  releaseDate?: string // Product release date
  additionalType?: string // Additional product type URL
  offers?: Array<{
    "@type": "Offer"
    price: number
    priceCurrency: string
    availability: string
    itemCondition: string
    url: string
    priceValidUntil: string
    seller: {
      "@type": "Organization"
      name: string
      url: string
      telephone: string
      address: {
        "@type": "PostalAddress"
        addressLocality: string
        addressRegion: string
        addressCountry: string
      }
    }
    weight?: string
    name?: string
    description?: string
  }>
}

export const products: Product[] = [
  {
    id: 1,
    name: "Blue Candy Gelato Nerdz",
    category: "Flower",
    description: "An exotic hybrid strain with a sweet candy and creamy gelato flavor profile. This premium flower offers a perfect balance of relaxation and euphoria. Features dense, colorful buds with rich purple hues and a sweet, candy-like aroma that's reminiscent of your favorite childhood treats.",
    effects: "Euphoric, Relaxed, Happy, Creative",
    imageUrl: "/blue-nerds-gelato.jpg",
    images: [
      "/blue-nerds-gelato.jpg",
      "/blue-nerds-gelato-33.jpg",
      "/blue-nerds-gelato-33-2.jpg",
      "/blue-nerds-gelato-33-3.jpg",
      "/blue-nerds-gelato-33-4.jpg"
    ],
    imageAlt: "Blue Candy Gelato Nerdz premium cannabis flower - exotic hybrid strain with purple hues and sweet candy aroma",
    metaDescription: "Premium Blue Candy Gelato Nerdz flower - An exotic hybrid cannabis strain with sweet candy and creamy gelato flavors. Lab-tested, premium quality, available for delivery in Minneapolis & St. Paul.",
    pricing: [
      { weight: "1.75g", size: "1.75g", price: 25 },
      { weight: "3.5g", size: "3.5g", price: 45 },
      { weight: "7g", size: "7g", price: 85 },
      { weight: "14g", size: "14g", price: 160 },
      { weight: "28g", size: "28g", price: 300 },
      { weight: "42g", size: "42g", price: 440 },
      { weight: "56g", size: "56g", price: 560 }
    ],
    soldOut: false,
    // Enhanced fields for Google structured data compliance
    sku: "BCGN-001",
    gtin: "123456789012", // Valid 12-digit GTIN
    mpn: "BGN-HYB-001", // Manufacturer Part Number
    condition: "New",
    brand: "DankDeals Premium",
    manufacturer: "DankDeals Cannabis Co.",
    model: "Blue Candy Gelato Nerdz",
    color: "Purple, Green",
    material: "Organic Cannabis Flower",
    strainType: "Hybrid",
    thcContent: "22-26%",
    cbdContent: "0.1-0.5%",
    thc: "22-26%", // Alias for backwards compatibility
    cbd: "0.1-0.5%", // Alias for backwards compatibility
    weight: "Available in multiple sizes",
    dimensions: "Varies by package size",
    productionCountry: "United States",
    targetAudience: "Adults 21+ in Minnesota",
    awards: ["2024 Cannabis Cup Winner", "Premium Quality Certified"],
    releaseDate: "2024-01-15",
    additionalType: "https://schema.org/Product",
    
    // Structured offers for Google compliance
    offers: [
      {
        "@type": "Offer",
        price: 25,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://dankdealsmn.com/product/blue-candy-gelato-nerdz",
        priceValidUntil: "2025-12-31",
        weight: "1.75g",
        name: "Blue Candy Gelato Nerdz - 1.75g",
        description: "Blue Candy Gelato Nerdz premium cannabis flower in 1.75g package. Perfect for trying this exotic hybrid strain.",
        seller: {
          "@type": "Organization",
          name: "DankDealsMN",
          url: "https://dankdealsmn.com",
          telephone: "+16129301390",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Minneapolis",
            addressRegion: "MN",
            addressCountry: "US"
          }
        }
      },
      {
        "@type": "Offer",
        price: 45,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://dankdealsmn.com/product/blue-candy-gelato-nerdz",
        priceValidUntil: "2025-12-31",
        weight: "3.5g",
        name: "Blue Candy Gelato Nerdz - 3.5g",
        description: "Blue Candy Gelato Nerdz premium cannabis flower in 3.5g package. Our most popular size for this sweet hybrid strain.",
        seller: {
          "@type": "Organization",
          name: "DankDealsMN",
          url: "https://dankdealsmn.com",
          telephone: "+16129301390",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Minneapolis",
            addressRegion: "MN",
            addressCountry: "US"
          }
        }
      },
      {
        "@type": "Offer",
        price: 85,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://dankdealsmn.com/product/blue-candy-gelato-nerdz",
        priceValidUntil: "2025-12-31",
        weight: "7g",
        name: "Blue Candy Gelato Nerdz - 7g",
        description: "Blue Candy Gelato Nerdz premium cannabis flower in 7g package. Great value for regular consumers of this premium strain.",
        seller: {
          "@type": "Organization",
          name: "DankDealsMN",
          url: "https://dankdealsmn.com",
          telephone: "+16129301390",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Minneapolis",
            addressRegion: "MN",
            addressCountry: "US"
          }
        }
      },
      {
        "@type": "Offer",
        price: 160,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://dankdealsmn.com/product/blue-candy-gelato-nerdz",
        priceValidUntil: "2025-12-31",
        weight: "14g",
        name: "Blue Candy Gelato Nerdz - 14g (Half Ounce)",
        description: "Blue Candy Gelato Nerdz premium cannabis flower in 14g half-ounce package. Perfect for sharing or stocking up.",
        seller: {
          "@type": "Organization",
          name: "DankDealsMN",
          url: "https://dankdealsmn.com",
          telephone: "+16129301390",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Minneapolis",
            addressRegion: "MN",
            addressCountry: "US"
          }
        }
      },
      {
        "@type": "Offer",
        price: 300,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://dankdealsmn.com/product/blue-candy-gelato-nerdz",
        priceValidUntil: "2025-12-31",
        weight: "28g",
        name: "Blue Candy Gelato Nerdz - 28g (Full Ounce)",
        description: "Blue Candy Gelato Nerdz premium cannabis flower in 28g full ounce package. Best value for this premium hybrid strain.",
        seller: {
          "@type": "Organization",
          name: "DankDealsMN",
          url: "https://dankdealsmn.com",
          telephone: "+16129301390",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Minneapolis",
            addressRegion: "MN",
            addressCountry: "US"
          }
        }
      },
      {
        "@type": "Offer",
        price: 440,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://dankdealsmn.com/product/blue-candy-gelato-nerdz",
        priceValidUntil: "2025-12-31",
        weight: "42g",
        name: "Blue Candy Gelato Nerdz - 42g (1.5 Ounce)",
        description: "Blue Candy Gelato Nerdz premium cannabis flower in 42g package. Bulk pricing for serious connoisseurs.",
        seller: {
          "@type": "Organization",
          name: "DankDealsMN",
          url: "https://dankdealsmn.com",
          telephone: "+16129301390",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Minneapolis",
            addressRegion: "MN",
            addressCountry: "US"
          }
        }
      },
      {
        "@type": "Offer",
        price: 560,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: "https://dankdealsmn.com/product/blue-candy-gelato-nerdz",
        priceValidUntil: "2025-12-31",
        weight: "56g",
        name: "Blue Candy Gelato Nerdz - 56g (2 Ounce)",
        description: "Blue Candy Gelato Nerdz premium cannabis flower in 56g two-ounce package. Maximum bulk discount available.",
        seller: {
          "@type": "Organization",
          name: "DankDealsMN",
          url: "https://dankdealsmn.com",
          telephone: "+16129301390",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Minneapolis",
            addressRegion: "MN",
            addressCountry: "US"
          }
        }
      }
    ],
    
    reviews: [
      {
        id: 1,
        author: "Jake S.",
        rating: 5,
        comment: "This strain is absolutely incredible! The flavor is exactly like sweet candy with a creamy finish. Effects are perfectly balanced - relaxing but not sedating. This is now my go-to strain for evening relaxation.",
        date: "2025-06-15"
      },
      {
        id: 2,
        author: "Mia R.",
        rating: 5,
        comment: "This strain hits different 🔥 Perfect balance and the taste is unreal. Got me feeling creative and relaxed at the same time. The buds are gorgeous with amazing purple colors. Definitely premium quality.",
        date: "2025-06-12"
      },
      {
        id: 3,
        author: "Tyler D.",
        rating: 5,
        comment: "No cap this is the best flower I've had in MN. Smooth af and the high lasts forever. The candy flavor comes through perfectly and the effects are exactly what I want from a hybrid. Definitely copping more.",
        date: "2025-06-08"
      },
      {
        id: 4,
        author: "Ashley M.",
        rating: 5,
        comment: "Really amazing strain! The candy flavor is legit and it helped with my anxiety while keeping me creative. The quality is top-notch and the effects are consistent. Love the variety of sizes available.",
        date: "2025-06-05"
      },
      {
        id: 5,
        author: "Marcus T.",
        rating: 5,
        comment: "Been smoking for 15 years and this is some of the best flower I've ever had. The terpene profile is incredible - sweet, fruity, with that gelato creaminess. Effects are perfectly balanced hybrid.",
        date: "2025-06-01"
      },
      {
        id: 6,
        author: "Sarah K.",
        rating: 5,
        comment: "Perfect strain for unwinding after work. The candy taste is amazing and the effects help me relax without making me too sleepy. The purple colors in the buds are beautiful. Premium quality for sure.",
        date: "2025-05-28"
      },
      {
        id: 7,
        author: "David L.",
        rating: 4,
        comment: "Great hybrid strain with excellent flavor. The candy notes are prominent and the effects are well-balanced. Only giving 4 stars because I wish the larger sizes were slightly more discounted, but the quality is definitely there.",
        date: "2025-05-24"
      },
      {
        id: 8,
        author: "Emma W.",
        rating: 5,
        comment: "This is hands down the best tasting strain I've tried. The gelato and candy flavors are so pronounced. Perfect for creative activities or just chilling. The effects last a long time too.",
        date: "2025-05-20"
      }
    ]
  }
]
