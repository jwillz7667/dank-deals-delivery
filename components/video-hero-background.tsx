"use client"
import { useState, useEffect, useRef } from "react"

interface VideoBackgroundProps {
  opacity?: number
}

const videos = [
  "/hero-videos/dankdeals-grow-1.mp4",
  "/hero-videos/DankDeals-grow-2.mp4",
  "/hero-videos/dankdeals-trimming.mp4",
  "/hero-videos/dankdeals-drying.mp4"
]

export default function VideoHeroBackground({ opacity = 0.75 }: VideoBackgroundProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videosLoaded, setVideosLoaded] = useState(new Set<number>())
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)

  // Preload the next video
  useEffect(() => {
    const preloadVideo = (index: number) => {
      const video = document.createElement('video')
      video.src = videos[index]
      video.load()
    }
    
    // Preload next video
    preloadVideo(nextVideoIndex)
  }, [nextVideoIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      
      // After fade transition completes
      setTimeout(() => {
        setCurrentVideoIndex(nextVideoIndex)
        setNextVideoIndex((nextVideoIndex + 1) % videos.length)
        setIsTransitioning(false)
      }, 1000) // 1 second fade transition
    }, 8000) // Change video every 8 seconds

    return () => clearInterval(interval)
  }, [nextVideoIndex])

  const handleVideoLoad = (index: number) => {
    setVideosLoaded(prev => new Set([...prev, index]))
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Fallback gradient background while videos load */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-green-800/20" />
      
      {/* Current video */}
      <video
        ref={currentVideoRef}
        key={`current-${currentVideoIndex}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => handleVideoLoad(currentVideoIndex)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ opacity: videosLoaded.has(currentVideoIndex) ? opacity : 0 }}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Next video (for smooth transition) */}
      <video
        ref={nextVideoRef}
        key={`next-${nextVideoIndex}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => handleVideoLoad(nextVideoIndex)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ opacity: videosLoaded.has(nextVideoIndex) ? opacity : 0 }}
      >
        <source src={videos[nextVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Mobile performance optimization - reduce opacity on smaller screens */}
      <style jsx>{`
        @media (max-width: 768px) {
          video {
            opacity: ${opacity * 0.8} !important;
          }
        }
      `}</style>
    </div>
  )
} 