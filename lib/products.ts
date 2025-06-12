export interface Product {
  id: number
  name: string
  category: "Flower" | "Edibles" | "Vapes"
  description: string
  effects: string
  imageUrl: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Cosmic Crisp Flower",
    category: "Flower",
    description:
      "A vibrant, sativa-dominant hybrid known for its uplifting and creative effects. Features a crisp apple aroma with earthy undertones.",
    effects: "Energetic, Creative, Uplifted, Focused",
    imageUrl: "/cannabis-bud.png",
  },
  {
    id: 2,
    name: "Galaxy Gummy Bites",
    category: "Edibles",
    description:
      "Deliciously sour, these multi-flavored gummies provide a balanced body and head high, perfect for relaxing without sedation.",
    effects: "Relaxed, Happy, Euphoric, Giggly",
    imageUrl: "/space-gummies.png",
  },
  {
    id: 3,
    name: "Nebula Haze Vape",
    category: "Vapes",
    description:
      "A smooth and discreet vape cartridge with a sweet, citrusy flavor. Ideal for on-the-go use to manage stress and anxiety.",
    effects: "Calm, Focused, Uplifted",
    imageUrl: "/sleek-vape-pen.png",
  },
  {
    id: 4,
    name: "Midnight Indica Flower",
    category: "Flower",
    description:
      "A potent indica strain perfect for evening use. Helps with deep relaxation and promotes a restful night's sleep.",
    effects: "Sleepy, Relaxed, Hungry, Euphoric",
    imageUrl: "/dark-purple-cannabis-bud.png",
  },
  {
    id: 5,
    name: "Solar Flare Sativa",
    category: "Flower",
    description:
      "An intensely energetic sativa that is perfect for daytime activities, creative projects, or social gatherings.",
    effects: "Energetic, Talkative, Creative, Uplifted",
    imageUrl: "/cannabis-bud.png",
  },
  {
    id: 6,
    name: "Chillwave Chocolate Bar",
    category: "Edibles",
    description:
      "A rich dark chocolate bar infused with a hybrid extract for a mellow, full-body experience. Great for movie nights.",
    effects: "Relaxed, Happy, Calm, Mellow",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 7,
    name: "Zero-G Hybrid Vape",
    category: "Vapes",
    description:
      "A perfectly balanced hybrid vape offering the best of both worlds. Eases the mind while gently energizing the body.",
    effects: "Balanced, Happy, Relaxed, Uplifted",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 8,
    name: "Lemon Rocket Fuel",
    category: "Flower",
    description:
      "A zesty, lemon-scented sativa that hits fast and hard. Recommended for experienced users seeking a powerful cerebral high.",
    effects: "Euphoric, Energetic, Focused",
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
]
