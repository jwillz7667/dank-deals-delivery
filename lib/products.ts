export interface WeightPrice {
  weight: string
  price: number
}

export interface Product {
  id: number
  name: string
  category: "Flower" | "Edibles" | "Vapes"
  description: string
  effects: string
  imageUrl: string
  pricing?: WeightPrice[]
  soldOut?: boolean
}

export const products: Product[] = [
  {
    id: 1,
    name: "Blue Candy Gelato Nerdz",
    category: "Flower",
    description:
      "An exotic hybrid strain with a sweet candy and creamy gelato flavor profile. This premium flower offers a perfect balance of relaxation and euphoria.",
    effects: "Euphoric, Relaxed, Happy, Creative",
    imageUrl: "/king-bud-default.png",
    pricing: [
      { weight: "1.75g", price: 25 },
      { weight: "3.5g", price: 45 },
      { weight: "7g", price: 85 },
      { weight: "14g", price: 160 },
      { weight: "28g", price: 300 },
      { weight: "42g", price: 440 },
      { weight: "56g", price: 560 }
    ],
    soldOut: false
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
