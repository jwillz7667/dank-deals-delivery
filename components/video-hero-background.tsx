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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const transitionTimeoutRef = useRef<NodeJS.Timeout>()
  const intervalRef = useRef<NodeJS.Timeout>()

  // Handle video transitions
  useEffect(() => {
    const handleVideoTransition = () => {
      setIsTransitioning(true)
      
      // Wait for fade out, then switch videos
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
        setIsTransitioning(false)
      }, 1000) // 1 second for smooth fade
    }

    // Start the video rotation
    intervalRef.current = setInterval(handleVideoTransition, 10000) // Change every 10 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [])

  // Play video when it becomes current
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex]
    if (currentVideo && !isTransitioning) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        currentVideo.play().catch(() => {
          // Autoplay might be blocked, handle silently
        })
      }, 100)
    }
  }, [currentVideoIndex, isTransitioning])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-black to-green-800/30" />
      
      {/* Videos - render all but only show current */}
      {videos.map((video, index) => (
        <div
          key={`video-wrapper-${index}`}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: index === currentVideoIndex && !isTransitioning ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: index === currentVideoIndex ? 2 : 1
          }}
        >
          <video
            ref={(el) => { videoRefs.current[index] = el }}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity }}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/25 z-10" />
    </div>
  )
} 