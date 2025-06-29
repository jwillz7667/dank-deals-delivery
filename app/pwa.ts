// PWA registration and install prompt handling

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('Service Worker registered successfully:', registration);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// PWA Install Prompt Handler
let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function initializePWAInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // Show custom install UI
    showInstallPromotion();
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    hideInstallPromotion();
    // Track installation
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pwa_installed');
    }
  });
}

export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return false;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to the install prompt: ${outcome}`);
  
  // Track the outcome
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('pwa_install_prompt', { props: { outcome } });
  }
  
  // We've used the prompt, and can't use it again, discard it
  deferredPrompt = null;
  
  if (outcome === 'accepted') {
    hideInstallPromotion();
  }
  
  return outcome === 'accepted';
}

function showInstallPromotion() {
  // Dispatch custom event that components can listen to
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
}

function hideInstallPromotion() {
  // Dispatch custom event to hide install UI
  window.dispatchEvent(new CustomEvent('pwa-install-hidden'));
}

// Utility to check if app is installed
export function isPWAInstalled() {
  // For iOS
  if ('standalone' in navigator) {
    return (navigator as any).standalone;
  }
  
  // For Android/Desktop
  return window.matchMedia('(display-mode: standalone)').matches;
}

// Initialize push notifications
export async function initializePushNotifications() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      ),
    });
    
    // Send subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
} 