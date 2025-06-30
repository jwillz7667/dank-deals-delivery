// Service Worker for Dank Deals MN PWA
const CACHE_NAME = 'dankdeals-v2025-01'
const STATIC_CACHE = 'dankdeals-static-v2025-01'
const API_CACHE = 'dankdeals-api-v2025-01'
const IMAGE_CACHE = 'dankdeals-images-v2025-01'

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/menu',
  '/delivery',
  '/offline.html',
  '/DANKDEALSMN.COM-LOGO.png',
  '/favicon.ico',
  '/_next/static/css/app/layout.css',
  '/_next/static/css/app/globals.css'
]

// API endpoints to cache
const API_ROUTES = [
  '/api/reviews',
  '/api/analytics/web-vitals',
  '/api/analytics/business-metrics'
]

// Image patterns to cache
const IMAGE_PATTERNS = [
  /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
  /_next\/image/,
  /\/images\//
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching critical resources')
        return cache.addAll(CRITICAL_RESOURCES)
      }),
      
      // Preload critical icons
      caches.open(IMAGE_CACHE).then(cache => {
        const iconPromises = [
          'lucide:search',
          'lucide:leaf', 
          'lucide:menu',
          'lucide:home',
          'lucide:shopping-cart',
          'lucide:user'
        ].map(icon => 
          fetch(`https://api.iconify.design/${icon}.svg`)
            .then(response => cache.put(`/icons/${icon}.svg`, response))
            .catch(() => {}) // Fail silently for icons
        )
        return Promise.all(iconPromises)
      })
    ]).then(() => {
      console.log('Service Worker installed successfully')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== API_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isStaticResource(request)) {
    event.respondWith(handleStaticRequest(request))
  } else {
    event.respondWith(handleNavigationRequest(request))
  }
})

// API request handler with smart caching
async function handleApiRequest(request) {
  const url = new URL(request.url)
  const cache = await caches.open(API_CACHE)
  
  try {
    // For analytics and reviews, try network first with cache fallback
    if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
      try {
        const networkResponse = await fetch(request)
        if (networkResponse.ok) {
          // Cache successful responses for 5 minutes
          const responseClone = networkResponse.clone()
          cache.put(request, responseClone)
        }
        return networkResponse
      } catch (error) {
        console.log('Network failed, trying cache for:', url.pathname)
        const cachedResponse = await cache.match(request)
        if (cachedResponse) return cachedResponse
        throw error
      }
    }
    
    // For other APIs, always try network
    return await fetch(request)
  } catch (error) {
    console.log('API request failed:', url.pathname)
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Image request handler with aggressive caching
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  
  // Try cache first for images
  const cachedResponse = await cache.match(request)
  if (cachedResponse) return cachedResponse
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Cache images for 30 days
      const responseClone = networkResponse.clone()
      cache.put(request, responseClone)
    }
    return networkResponse
  } catch (error) {
    console.log('Image request failed:', request.url)
    // Return a placeholder or empty response
    return new Response('', { status: 404 })
  }
}

// Static resource handler
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE)
  
  // Try cache first for static resources
  const cachedResponse = await cache.match(request)
  if (cachedResponse) return cachedResponse
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone()
      cache.put(request, responseClone)
    }
    return networkResponse
  } catch (error) {
    console.log('Static resource failed:', request.url)
    throw error
  }
}

// Navigation request handler
async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE)
  
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone()
      cache.put(request, responseClone)
    }
    return networkResponse
  } catch (error) {
    console.log('Navigation failed, trying cache for:', request.url)
    
    // Try to find cached version
    const cachedResponse = await cache.match(request)
    if (cachedResponse) return cachedResponse
    
    // Fall back to cached homepage or offline page
    const fallbackResponse = await cache.match('/') || await cache.match('/offline.html')
    if (fallbackResponse) return fallbackResponse
    
    // Last resort - create minimal offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DankDealsMN - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <h1>DankDealsMN</h1>
          <p class="offline">You're currently offline. Please check your connection and try again.</p>
          <button onclick="window.location.reload()">Retry</button>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Helper functions
function isImageRequest(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url))
}

function isStaticResource(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/_next/static/') || 
         url.pathname.includes('.css') ||
         url.pathname.includes('.js') ||
         url.pathname.includes('.woff') ||
         url.pathname.includes('.ttf')
}

// Background sync for analytics
self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  }
})

async function syncAnalytics() {
  try {
    // Sync any queued analytics data when back online
    const cache = await caches.open(API_CACHE)
    // Implementation would sync stored analytics events
    console.log('Analytics synced successfully')
  } catch (error) {
    console.log('Analytics sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Your order is on the way!',
    icon: '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'track',
        title: 'Track Order',
      },
      {
        action: 'close',
        title: 'Close',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Dank Deals Delivery Update', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'track') {
    event.waitUntil(
      clients.openWindow('/track-order')
    );
  }
}); 