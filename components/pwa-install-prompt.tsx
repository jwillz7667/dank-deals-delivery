"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { registerServiceWorker, initializePWAInstallPrompt, showInstallPrompt, isPWAInstalled } from '@/app/pwa'
import { useToast } from '@/hooks/use-toast'
import { DankIcon } from '@/lib/icons'
import { useAnalytics } from '@/components/analytics'

// Defer analytics until PWA prompt is actually shown
const useAnalyticsDeferred = () => {
  const [analytics, setAnalytics] = useState<any>(null)
  
  useEffect(() => {
    // Only load analytics when PWA prompt is being used
    if (analytics === null) {
      import('@/components/analytics').then((mod) => {
        setAnalytics(mod.useAnalytics())
      })
    }
  }, [analytics])
  
  return analytics
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const { toast } = useToast()
  const analytics = useAnalyticsDeferred() // Use deferred analytics

  useEffect(() => {
    // Register service worker
    registerServiceWorker()
    
    // Check if already installed
    if (isPWAInstalled()) {
      setIsInstalled(true)
      return
    }

    // Initialize PWA install prompt
    initializePWAInstallPrompt()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      // Track installation with deferred analytics
      if (analytics?.events?.pwaInstall) {
        analytics.events.pwaInstall()
      }
      toast({
        title: "App Installed!",
        description: "DankDeals has been added to your home screen.",
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [toast, analytics])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    
    try {
      const accepted = await showInstallPrompt()
      
      if (accepted) {
        // Track successful install prompt acceptance
        if (analytics?.events?.pwaInstallPromptAccepted) {
          analytics.events.pwaInstallPromptAccepted()
        }
      } else {
        // Track install prompt dismissal
        if (analytics?.events?.pwaInstallPromptDismissed) {
          analytics.events.pwaInstallPromptDismissed()
        }
      }
    } catch (error) {
      console.error('Error installing PWA:', error)
      toast({
        title: "Installation Error",
        description: "There was a problem installing the app. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsInstalling(false)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDeferredPrompt(null)
    // Track dismissal with deferred analytics
    if (analytics?.events?.pwaInstallPromptDismissed) {
      analytics.events.pwaInstallPromptDismissed()
    }
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DankIcon name="download" size={20} className="text-primary" />
              Add to Home Screen
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <DankIcon name="close" size={16} />
            </Button>
          </div>
          <CardDescription>
            Install our app for a faster, native experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <DankIcon name="check" size={16} className="text-green-500" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center gap-2">
              <DankIcon name="check" size={16} className="text-green-500" />
              <span>Get order notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <DankIcon name="check" size={16} className="text-green-500" />
              <span>Faster loading</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1">
              Install App
            </Button>
            <Button variant="outline" onClick={handleDismiss}>
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}