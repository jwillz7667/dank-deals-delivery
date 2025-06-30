"use client"

import { memo } from "react"
import Link from "next/link"
import { LeafIcon, CookieIcon, CigaretteIcon, HeartIcon, PillIcon, SparklesIcon } from "@/lib/icons"
import dynamic from "next/dynamic"
import { FreeMode } from 'swiper/modules'

// Lazy load Swiper to reduce initial bundle size
const Swiper = dynamic(() => import('swiper/react').then(mod => ({ default: mod.Swiper })), {
  ssr: false
})
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => ({ default: mod.SwiperSlide })), {
  ssr: false
})

const categories = [
  { name: "Flower", Icon: LeafIcon, href: "/menu?category=flower" },
  { name: "Edibles", Icon: CookieIcon, href: "/menu?category=edibles" },
  { name: "Prerolls", Icon: CigaretteIcon, href: "/menu?category=prerolls" },
  { name: "Wellness", Icon: HeartIcon, href: "/menu?category=wellness" },
  { name: "Vapes", Icon: SparklesIcon, href: "/menu?category=vapes" },
  { name: "Concentrates", Icon: PillIcon, href: "/menu?category=concentrates" },
]

const CategoryItem = memo(function CategoryItem({ 
  category, 
  index,
  isMobile = false 
}: { 
  category: typeof categories[0]
  index: number
  isMobile?: boolean
}) {
  const { name, Icon, href } = category
  const size = isMobile ? "w-20 h-20" : "w-32 h-32"
  const iconSize = isMobile ? 20 : 32
  const textSize = isMobile ? "text-xs" : "text-lg"

  return (
    <Link href={href}>
      <div 
        className={`flex flex-col items-center justify-center ${size} rounded-2xl text-white ${textSize} font-medium transition-all duration-300 hover:scale-105 floating-effect animate-scale-in shadow-xl backdrop-blur-lg border border-white/20`}
        style={{ 
          background: 'linear-gradient(135deg, #2B5D3F 0%, #225031 100%)',
          animationDelay: `${index * 100}ms` 
        }}
      >
        <Icon size={iconSize} className={isMobile ? "mb-1" : "mb-2"} />
        <span className="text-center leading-tight">{name}</span>
      </div>
    </Link>
  )
})

interface CategoriesSectionProps {
  isMobile?: boolean
}

export default memo(function CategoriesSection({ isMobile = false }: CategoriesSectionProps) {
  if (isMobile) {
    return (
      <div className="animate-slide-up mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Categories</h2>
        <Swiper
          slidesPerView="auto"
          spaceBetween={12}
          freeMode={true}
          modules={[FreeMode]}
          className="category-swiper"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={category.name} className="!w-auto">
              <CategoryItem category={category} index={index} isMobile={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }

  // Desktop version with static grid (better performance)
  return (
    <div className="mb-24 animate-slide-up">
      <h2 className="text-3xl font-semibold text-foreground mb-12">Shop by Category</h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {categories.map((category, index) => (
          <div key={category.name} className="flex-shrink-0">
            <CategoryItem category={category} index={index} isMobile={false} />
          </div>
        ))}
      </div>
    </div>
  )
}) 