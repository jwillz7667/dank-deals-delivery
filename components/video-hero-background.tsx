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
  const [videoOpacities, setVideoOpacities] = useState<number[]>(
    videos.map((_, index) => (index === 0 ? 1 : 0))
  )
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  // Handle video transitions with crossfade
  useEffect(() => {
    const handleVideoTransition = () => {
      const next = (currentVideoIndex + 1) % videos.length
      setNextVideoIndex(next)
      
      // Start playing the next video before transition
      const nextVideo = videoRefs.current[next]
      if (nextVideo) {
        nextVideo.currentTime = 0 // Reset to start
        nextVideo.playbackRate = 0.85 // Ensure playback speed is set
        nextVideo.play().catch(() => {
          // Handle autoplay restrictions silently
        })
      }

      // Start crossfade after a small delay to ensure next video is ready
      setTimeout(() => {
        // Create new opacity array with crossfade effect
        const newOpacities = videos.map((_, index) => {
          if (index === next) return 1 // Fade in next video
          if (index === currentVideoIndex) return 0 // Fade out current video
          return 0 // Keep others at 0
        })
        setVideoOpacities(newOpacities)

        // Update current index after transition completes
        setTimeout(() => {
          setCurrentVideoIndex(next)
        }, 1000) // Match transition duration
      }, 100)
    }

    // Start the video rotation
    intervalRef.current = setInterval(handleVideoTransition, 9400) // Change every 9.4 seconds (8s / 0.85)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentVideoIndex])

  // Preload and prepare videos
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.playbackRate = 0.85 // Set playback speed to 0.85x
        if (index === 0) {
          // Start playing the first video
          video.play().catch(() => {
            // Handle autoplay restrictions silently
          })
        } else {
          // Preload other videos
          video.load()
        }
      }
    })
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-black to-green-800/30" />
      
      {/* Videos - render all with individual opacity control */}
      {videos.map((video, index) => (
        <div
          key={`video-wrapper-${index}`}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: videoOpacities[index],
            transition: 'opacity 1.5s ease-in-out', // Smooth 1.5s crossfade
            zIndex: index === currentVideoIndex || index === nextVideoIndex ? 2 : 1
          }}
        >
          <video
            ref={(el) => { 
              videoRefs.current[index] = el
              if (el) el.playbackRate = 0.85 // Set playback rate on mount
            }}
            muted
            loop
            playsInline
            preload="auto" // Changed to auto for better preloading
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity }}
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement
              video.playbackRate = 0.85 // Ensure playback rate is set when metadata loads
            }}
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