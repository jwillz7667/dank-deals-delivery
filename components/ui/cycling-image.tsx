"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface CyclingImageProps {
  images: string[]
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export default function CyclingImage({ 
  images, 
  alt, 
  className = "", 
  priority = false, 
  sizes = "(max-width: 640px) 50vw, 25vw" 
}: CyclingImageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 2000) // Change image every 2 seconds

    return () => clearInterval(interval)
  }, [images.length])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            index === currentImageIndex 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={image}
            alt={`${alt} - Image ${index + 1}`}
            fill
            className={`object-cover transition-transform duration-500 hover:scale-110 ${className}`}
            priority={priority && index === 0}
            sizes={sizes}
          />
        </div>
      ))}
      
      {/* Image indicator dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white shadow-md' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 