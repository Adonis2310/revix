const CACHE_NAME = 'revix-v1'

const PRECACHE_URLS = [
  '/',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      ),
    ])
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Network-first for Supabase API calls
  if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    )
    return
  }

  // Network-first for navigation (Next.js pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok && !url.pathname.startsWith('/_next/')) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
