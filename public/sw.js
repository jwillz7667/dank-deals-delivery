// Enhanced Service Worker for Dank Deals MN PWA
// Follows web.dev best practices for performance and offline capability

const CACHE_VERSION = 'v2025-01-15'
const STATIC_CACHE = `dankdeals-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `dankdeals-dynamic-${CACHE_VERSION}`
const API_CACHE = `dankdeals-api-${CACHE_VERSION}`
const IMAGE_CACHE = `dankdeals-images-${CACHE_VERSION}`

// Cache strategies configuration
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'CACHE_FIRST',
  NETWORK_FIRST: 'NETWORK_FIRST',
  STALE_WHILE_REVALIDATE: 'STALE_WHILE_REVALIDATE',
  NETWORK_ONLY: 'NETWORK_ONLY',
  CACHE_ONLY: 'CACHE_ONLY'
}

// Critical resources to precache
const PRECACHE_RESOURCES = [
  '/',
  '/menu',
  '/delivery',
  '/offline',
  '/manifest.json',
  '/DANKDEALSMN.COM-LOGO.png',
  '/favicon.ico'
]

// API endpoints configuration
const API_CONFIG = {
  '/api/reviews': { strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, maxAge: 300000 }, // 5 minutes
  '/api/analytics/web-vitals': { strategy: CACHE_STRATEGIES.NETWORK_FIRST, maxAge: 60000 }, // 1 minute
  '/api/analytics/business-metrics': { strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, maxAge: 600000 }, // 10 minutes
  '/api/cart': { strategy: CACHE_STRATEGIES.NETWORK_FIRST, maxAge: 0 }, // Always fresh
  '/api/orders': { strategy: CACHE_STRATEGIES.NETWORK_ONLY, maxAge: 0 }, // Never cache
}

// Background sync configuration
const BACKGROUND_SYNC_TAGS = {
  ANALYTICS: 'analytics-sync',
  CART_UPDATES: 'cart-sync',
  USER_ACTIONS: 'user-actions-sync'
}

// Install event - precache critical resources
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      // Precache static resources
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Precaching static resources')
        return cache.addAll(PRECACHE_RESOURCES.map(url => new Request(url, { cache: 'reload' })))
      }),
      
      // Warm up image cache with critical assets
      caches.open(IMAGE_CACHE).then(cache => {
        const criticalImages = [
          '/DANKDEALSMN.COM-LOGO.png',
          '/og-image.png',
          '/apple-touch-icon.png'
        ]
        return Promise.all(
          criticalImages.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response)
              }
            }).catch(() => {}) // Fail silently for optional resources
          )
        )
      })
    ]).then(() => {
      console.log('[SW] Installation complete')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean old caches and claim clients
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Initialize IndexedDB for offline storage
      initializeOfflineStorage()
    ]).then(() => {
      console.log('[SW] Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement intelligent caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests and non-http protocols
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return
  
  // Route requests to appropriate handlers
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// API request handler with intelligent caching
async function handleApiRequest(request) {
  const url = new URL(request.url)
  const config = API_CONFIG[url.pathname] || { strategy: CACHE_STRATEGIES.NETWORK_FIRST, maxAge: 300000 }
  
  switch (config.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, API_CACHE, config.maxAge)
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, API_CACHE, config.maxAge)
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, API_CACHE, config.maxAge)
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request)
    
    default:
      return networkFirst(request, API_CACHE, config.maxAge)
  }
}

// Image request handler with aggressive caching
async function handleImageRequest(request) {
  return cacheFirst(request, IMAGE_CACHE, 86400000) // 24 hours
}

// Static asset handler
async function handleStaticAsset(request) {
  return cacheFirst(request, STATIC_CACHE, 31536000000) // 1 year
}

// Page request handler with offline support
async function handlePageRequest(request) {
  return staleWhileRevalidate(request, DYNAMIC_CACHE, 3600000) // 1 hour
}

// Cache-first strategy
async function cacheFirst(request, cacheName, maxAge = 3600000) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse
    }
    return createOfflineResponse(request)
  }
}

// Network-first strategy
async function networkFirst(request, cacheName, maxAge = 3600000) {
  const cache = await caches.open(cacheName)
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse
    }
    return createOfflineResponse(request)
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName, maxAge = 3600000) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Always attempt to update cache in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => {}) // Fail silently for background updates
  
  // Return cached response if available and fresh
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse
  }
  
  // Otherwise wait for network
  try {
    return await fetchPromise
  } catch (error) {
    return cachedResponse || createOfflineResponse(request)
  }
}

// Network-only strategy
async function networkOnly(request) {
  try {
    return await fetch(request)
  } catch (error) {
    return createOfflineResponse(request)
  }
}

// Helper functions
function isImageRequest(request) {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(new URL(request.url).pathname) ||
         request.url.includes('/_next/image') ||
         request.headers.get('Accept')?.includes('image/')
}

function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/_next/static/') ||
         /\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname)
}

function isExpired(response, maxAge) {
  const dateHeader = response.headers.get('date')
  if (!dateHeader) return true
  
  const responseTime = new Date(dateHeader).getTime()
  return Date.now() - responseTime > maxAge
}

function createOfflineResponse(request) {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ 
      error: 'Network unavailable',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Return offline page for navigation requests
  return caches.match('/offline').then(response => {
    return response || new Response(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - DankDealsMN</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f5f5f5;
            }
            .container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .logo { max-width: 150px; margin-bottom: 20px; }
            h1 { color: #2B5D3F; margin-bottom: 10px; }
            p { color: #666; margin-bottom: 20px; }
            button { 
              background: #2B5D3F; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 16px;
            }
            button:hover { background: #1a3d2e; }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="/DANKDEALSMN.COM-LOGO.png" alt="DankDealsMN" class="logo">
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  })
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  switch (event.tag) {
    case BACKGROUND_SYNC_TAGS.ANALYTICS:
      event.waitUntil(syncAnalytics())
      break
    case BACKGROUND_SYNC_TAGS.CART_UPDATES:
      event.waitUntil(syncCartUpdates())
      break
    case BACKGROUND_SYNC_TAGS.USER_ACTIONS:
      event.waitUntil(syncUserActions())
      break
  }
})

// Message handling for client communication
self.addEventListener('message', event => {
  const { type, data } = event.data
  
  switch (type) {
    case 'QUEUE_METRICS':
      queueAnalytics(data.metrics)
      break
    case 'QUEUE_CART_UPDATE':
      queueCartUpdate(data)
      break
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    case 'GET_CACHE_STATUS':
      event.ports[0].postMessage({ cacheStatus: getCacheStatus() })
      break
  }
})

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'Your cannabis delivery update is here!',
    icon: '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/track-order',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'track',
        title: 'Track Order',
        icon: '/icons/delivery-driver.svg'
      },
      {
        action: 'view-menu',
        title: 'Browse Menu',
        icon: '/icons/cannabis.svg'
      }
    ],
    requireInteraction: true,
    tag: 'delivery-update'
  }

  event.waitUntil(
    self.registration.showNotification('Dank Deals Delivery Update', options)
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  const { action, data } = event
  let url = '/'
  
  switch (action) {
    case 'track':
      url = '/track-order'
      break
    case 'view-menu':
      url = '/menu'
      break
    default:
      url = data?.url || '/'
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Focus existing tab if available
      for (const client of clientList) {
        if (client.url === new URL(url, self.location.origin).href) {
          return client.focus()
        }
      }
      // Open new tab
      return clients.openWindow(url)
    })
  )
})

// Offline storage management
async function initializeOfflineStorage() {
  if ('indexedDB' in self) {
    // Initialize IndexedDB for offline data storage
    // This could store cart data, user preferences, etc.
  }
}

// Analytics sync
async function syncAnalytics() {
  try {
    const queuedData = await getQueuedAnalytics()
    if (queuedData.length > 0) {
      await fetch('/.netlify/functions/web-vitals-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queuedData)
      })
      await clearQueuedAnalytics()
    }
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error)
  }
}

// Cart updates sync
async function syncCartUpdates() {
  try {
    const queuedUpdates = await getQueuedCartUpdates()
    for (const update of queuedUpdates) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })
    }
    await clearQueuedCartUpdates()
  } catch (error) {
    console.error('[SW] Cart sync failed:', error)
  }
}

// User actions sync
async function syncUserActions() {
  try {
    const queuedActions = await getQueuedUserActions()
    for (const action of queuedActions) {
      await fetch('/api/analytics/user-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      })
    }
    await clearQueuedUserActions()
  } catch (error) {
    console.error('[SW] User actions sync failed:', error)
  }
}

// Queue management functions (simplified - would use IndexedDB in production)
function queueAnalytics(metrics) {
  // Store in IndexedDB or localStorage for background sync
}

function queueCartUpdate(update) {
  // Store cart updates for sync when online
}

async function getQueuedAnalytics() {
  // Retrieve queued analytics data
  return []
}

async function getQueuedCartUpdates() {
  // Retrieve queued cart updates
  return []
}

async function getQueuedUserActions() {
  // Retrieve queued user actions
  return []
}

async function clearQueuedAnalytics() {
  // Clear synced analytics data
}

async function clearQueuedCartUpdates() {
  // Clear synced cart updates
}

async function clearQueuedUserActions() {
  // Clear synced user actions
}

function getCacheStatus() {
  return {
    version: CACHE_VERSION,
    caches: [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE]
  }
} 