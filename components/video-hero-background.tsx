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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Transition to next video
  const transitionToNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length
    const nextVideo = videoRefs.current[nextIndex]
    
    if (nextVideo) {
      // Reset and prepare next video
      nextVideo.currentTime = 0
      // Play next video
      nextVideo.play().catch(err => {
        console.error('Error playing video:', err)
      })
    }
    
    // Update the current index
    setCurrentVideoIndex(nextIndex)
  }

  // Monitor current video and handle transitions
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex]
    if (!currentVideo) return

    // Ensure video settings
    currentVideo.muted = true
    currentVideo.playbackRate = 0.85
    
    // Play current video
    const playCurrentVideo = async () => {
      try {
        await currentVideo.play()
      } catch (err) {
        console.error('Error playing current video:', err)
        // Retry after a short delay
        setTimeout(playCurrentVideo, 100)
      }
    }
    
    playCurrentVideo()

    // Check video progress for transition
    const checkProgress = () => {
      if (currentVideo.duration && !isNaN(currentVideo.duration)) {
        const timeLeft = currentVideo.duration - currentVideo.currentTime
        // Transition 1.5 seconds before end for smooth effect
        if (timeLeft <= 1.5 && timeLeft > 0) {
          transitionToNextVideo()
          // Clear interval to prevent multiple transitions
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }
    }

    // Set up interval to check progress
    intervalRef.current = setInterval(checkProgress, 100)

    // Also add ended listener as backup
    const handleEnded = () => {
      transitionToNextVideo()
    }
    currentVideo.addEventListener('ended', handleEnded)

    // Preload next video
    const nextIndex = (currentVideoIndex + 1) % videos.length
    const nextVideo = videoRefs.current[nextIndex]
    if (nextVideo) {
      nextVideo.load()
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      currentVideo.removeEventListener('ended', handleEnded)
    }
  }, [currentVideoIndex])

  // Initial setup
  useEffect(() => {
    // Configure all videos on mount
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true
        video.playsInline = true
        video.setAttribute('webkit-playsinline', 'true')
        video.setAttribute('x-webkit-airplay', 'allow')
      }
    })
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-black to-green-800/30" />
      
      {/* Videos - render all with individual opacity control */}
      {videos.map((videoSrc, index) => (
        <div
          key={`video-wrapper-${index}`}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: index === currentVideoIndex ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: index === currentVideoIndex ? 2 : 1,
            pointerEvents: 'none'
          }}
        >
          <video
            ref={(el) => { 
              videoRefs.current[index] = el
            }}
            muted
            playsInline
            preload={index === 0 || index === 1 ? "auto" : "metadata"}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity }}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/25 z-10" />
    </div>
  )
}