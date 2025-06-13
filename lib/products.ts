export interface WeightPrice {
  weight: string
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
}

export const products: Product[] = [
  {
    id: 1,
    name: "Blue Candy Gelato Nerdz",
    category: "Flower",
    description:
      "An exotic hybrid strain with a sweet candy and creamy gelato flavor profile. This premium flower offers a perfect balance of relaxation and euphoria.",
    effects: "Euphoric, Relaxed, Happy, Creative",
    imageUrl: "/blue-nerds-gelato.jpg",
    images: [
      "/blue-nerds-gelato.jpg",
      "/blue-nerds-gelato-33.jpg",
      "/blue-nerds-gelato-33-2.jpg",
      "/blue-nerds-gelato-33-3.jpg",
      "/blue-nerds-gelato-33-4.jpg"
    ],
    imageAlt: "Blue Candy Gelato Nerdz premium cannabis flower - exotic hybrid strain with purple hues",
    metaDescription: "Premium Blue Candy Gelato Nerdz flower - An exotic hybrid cannabis strain with sweet candy and creamy gelato flavors. Available for delivery in Minneapolis & St. Paul.",
    pricing: [
      { weight: "1.75g", price: 25 },
      { weight: "3.5g", price: 45 },
      { weight: "7g", price: 85 },
      { weight: "14g", price: 160 },
      { weight: "28g", price: 300 },
      { weight: "42g", price: 440 },
      { weight: "56g", price: 560 }
    ],
    soldOut: false,
    reviews: [
      {
        id: 1,
        author: "Jake S.",
        rating: 5,
        comment: "bro,im so high right now. this shit is fire",
        date: "2025-06-22"
      },
      {
        id: 2,
        author: "Mia R.",
        rating: 5,
        comment: "This strain hits different 🔥 Perfect balance and the taste is unreal. Got me feeling creative and relaxed at the same time",
        date: "2025-06-19"
      },
      {
        id: 3,
        author: "Tyler D.",
        rating: 5,
        comment: "No cap this is the best flower I've had in MN. Smooth af and the high lasts forever. Definitely copping more",
        date: "2025-06-15"
      },
      {
        id: 4,
        author: "Ashley M.",
        rating: 4,
        comment: "Really good strain! The candy flavor is legit and it helped with my anxiety. Only giving 4 stars cuz I wish they had bigger bags available",
        date: "2025-06-12"
      }
    ]
  },
  {
    id: 2,
    name: "Cosmic Crisp Flower",
    category: "Flower",
    description:
      "A vibrant, sativa-dominant hybrid known for its uplifting and creative effects. Features a crisp apple aroma with earthy undertones.",
    effects: "Energetic, Creative, Uplifted, Focused",
    imageUrl: "/cannabis-bud.png",
    soldOut: true
  },
  {
    id: 3,
    name: "Galaxy Gummy Bites",
    category: "Edibles",
    description:
      "Deliciously sour, these multi-flavored gummies provide a balanced body and head high, perfect for relaxing without sedation.",
    effects: "Relaxed, Happy, Euphoric, Giggly",
    imageUrl: "/space-gummies.png",
    soldOut: true
  },
  {
    id: 4,
    name: "Nebula Haze Vape",
    category: "Vapes",
    description:
      "A smooth and discreet vape cartridge with a sweet, citrusy flavor. Ideal for on-the-go use to manage stress and anxiety.",
    effects: "Calm, Focused, Uplifted",
    imageUrl: "/sleek-vape-pen.png",
    soldOut: true
  },
  {
    id: 5,
    name: "Midnight Indica Flower",
    category: "Flower",
    description:
      "A potent indica strain perfect for evening use. Helps with deep relaxation and promotes a restful night's sleep.",
    effects: "Sleepy, Relaxed, Hungry, Euphoric",
    imageUrl: "/dark-purple-cannabis-bud.png",
    soldOut: true
  },
  {
    id: 6,
    name: "Solar Flare Sativa",
    category: "Flower",
    description:
      "An intensely energetic sativa that is perfect for daytime activities, creative projects, or social gatherings.",
    effects: "Energetic, Talkative, Creative, Uplifted",
    imageUrl: "/cannabis-bud.png",
    soldOut: true
  },
  {
    id: 7,
    name: "Chillwave Chocolate Bar",
    category: "Edibles",
    description:
      "A rich dark chocolate bar infused with a hybrid extract for a mellow, full-body experience. Great for movie nights.",
    effects: "Relaxed, Happy, Calm, Mellow",
    imageUrl: "/placeholder.svg?height=400&width=400",
    soldOut: true
  },
  {
    id: 8,
    name: "Zero-G Hybrid Vape",
    category: "Vapes",
    description:
      "A perfectly balanced hybrid vape offering the best of both worlds. Eases the mind while gently energizing the body.",
    effects: "Balanced, Happy, Relaxed, Uplifted",
    imageUrl: "/placeholder.svg?height=400&width=400",
    soldOut: true
  },
  {
    id: 9,
    name: "Lemon Rocket Fuel",
    category: "Flower",
    description:
      "A zesty, lemon-scented sativa that hits fast and hard. Recommended for experienced users seeking a powerful cerebral high.",
    effects: "Euphoric, Energetic, Focused",
    imageUrl: "/placeholder.svg?height=400&width=400",
    soldOut: true
  },
]
