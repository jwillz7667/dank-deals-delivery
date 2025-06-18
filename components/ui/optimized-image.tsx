"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  loading?: "lazy" | "eager"
  quality?: number
  sizes?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  onClick?: () => void
}

// Map of original images to their optimized versions
const OPTIMIZED_IMAGE_MAP: Record<string, { webp: string; avif: string; fallback?: string }> = {
  "/cannabis-bud.png": {
    webp: "/cannabis-bud-optimized.webp",
    avif: "/cannabis-bud-optimized.avif",
    fallback: "/cannabis-bud-optimized.jpg"
  },
  "/king-bud-default.png": {
    webp: "/king-bud-default-optimized.webp",
    avif: "/king-bud-default-optimized.avif",
    fallback: "/king-bud-default-optimized.jpg"
  },
  "/dark-purple-cannabis-bud.png": {
    webp: "/dark-purple-cannabis-bud-optimized.webp",
    avif: "/dark-purple-cannabis-bud-optimized.avif",
    fallback: "/dark-purple-cannabis-bud-optimized.jpg"
  },
  "/space-gummies.png": {
    webp: "/space-gummies-optimized.webp",
    avif: "/space-gummies-optimized.avif",
    fallback: "/space-gummies-optimized.jpg"
  },
  "/sleek-vape-pen.png": {
    webp: "/sleek-vape-pen-optimized.webp",
    avif: "/sleek-vape-pen-optimized.avif",
    fallback: "/sleek-vape-pen-optimized.jpg"
  },
  "/blue-nerds-gelato.jpg": {
    webp: "/blue-nerds-gelato-optimized.webp",
    avif: "/blue-nerds-gelato-optimized.avif"
  }
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  loading = "lazy",
  quality = 85,
  sizes,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
  onClick
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Get optimized image sources
  const optimizedSources = OPTIMIZED_IMAGE_MAP[src]
  const imageSrc = optimizedSources?.webp || src
  
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  // Enhanced loading placeholder with skeleton animation
  const LoadingPlaceholder = () => (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
        "relative overflow-hidden",
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  )

  return (
    <div className={cn("relative overflow-hidden", fill && "w-full h-full")}>
      {/* Show loading placeholder if not loaded */}
      {!isLoaded && !hasError && <LoadingPlaceholder />}
      
      {/* Native HTML picture element for better format support */}
      {optimizedSources && !hasError ? (
        <picture className={cn("block", fill && "w-full h-full")}>
          {/* AVIF format (best compression) */}
          <source srcSet={optimizedSources.avif} type="image/avif" />
          
          {/* WebP format (good compression, wide support) */}
          <source srcSet={optimizedSources.webp} type="image/webp" />
          
          {/* Fallback to Next.js Image component */}
          <Image
            src={optimizedSources.fallback || imageSrc}
            alt={alt}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            fill={fill}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            priority={priority}
            loading={loading}
            quality={quality}
            sizes={sizes}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            style={fill ? { objectFit: "cover" } : undefined}
            onClick={onClick}
          />
        </picture>
      ) : (
        /* Fallback to standard Next.js Image */
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          priority={priority}
          loading={loading}
          quality={quality}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          style={fill ? { objectFit: "cover" } : undefined}
          onClick={onClick}
        />
      )}
    </div>
  )
} 