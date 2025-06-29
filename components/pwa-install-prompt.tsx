'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DankIcon } from '@/lib/icons'
import { useToast } from '@/hooks/use-toast'
import { registerServiceWorker, initializePWAInstallPrompt, showInstallPrompt, isPWAInstalled } from '@/app/pwa'
import { useAnalytics } from '@/components/analytics'

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const { toast } = useToast()
  const { events } = useAnalytics()

  useEffect(() => {
    // Check if already installed
    if (isPWAInstalled()) {
      setIsInstalled(true)
      return
    }

    // Register service worker
    registerServiceWorker()

    // Initialize install prompt
    initializePWAInstallPrompt()

    // Listen for install available event
    const handleInstallAvailable = () => {
      // Don't show immediately, wait for user interaction
      setTimeout(() => {
        setShowPrompt(true)
        events.pwaInstallPromptShown()
      }, 30000) // Show after 30 seconds
    }

    const handleInstallHidden = () => {
      setShowPrompt(false)
    }

    window.addEventListener('pwa-install-available', handleInstallAvailable)
    window.addEventListener('pwa-install-hidden', handleInstallHidden)

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable)
      window.removeEventListener('pwa-install-hidden', handleInstallHidden)
    }
  }, [events])

  const handleInstall = async () => {
    const accepted = await showInstallPrompt()
    
    if (accepted) {
      events.pwaInstallAccepted()
      toast({
        title: 'App installed!',
        description: 'You can now access Dank Deals from your home screen.',
      })
      setShowPrompt(false)
      setIsInstalled(true)
    } else {
      events.pwaInstallDismissed()
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    events.pwaInstallDismissed()
    
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // Check if recently dismissed
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        setShowPrompt(false)
      }
    }
  }, [])

  if (!showPrompt || isInstalled) {
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