// Smart Service Worker for Van Gogh Digital Guide
// Implements data-first caching for client-side rendering

const CACHE_NAME = 'van-gogh-cache-v4';
const DATA_CACHE = 'van-gogh-data-v4';
const ASSETS_CACHE = 'van-gogh-assets-v4';
const STATIC_CACHE = 'van-gogh-static-v4';

// Supported locales
const SUPPORTED_LOCALES = ['en-GB', 'zh-TW', 'zh-CN'];

// Static assets that should always be cached
const STATIC_ASSETS = [
  '/van-gogh-assets/fallback-image.jpg',
  '/van-gogh-assets/silence.aac',
  '/van-gogh-assets/mp3/silence.mp3',
  '/van-gogh-assets/p21.png',
  '/van-gogh-assets/p27.png', 
  '/van-gogh-assets/p33.png',
  '/van-gogh-assets/p44.png',
  '/van-gogh-assets/p8.png',
  '/van-gogh-assets/r3.png',
  '/van-gogh-assets/r6.png',
  '/van-gogh-assets/manifest.json',
  '/van-gogh-assets/favicon-96x96.png',
  '/van-gogh-assets/favicon.svg',
  '/van-gogh-assets/icon-192x192.png',
  '/van-gogh-assets/icon-512x512.png',
  '/van-gogh-assets/apple-touch-icon.png'
];

// Essential pages to cache for instant SPA-like navigation
const PAGES_TO_CACHE = [
  // Core pages for instant navigation - cache first few rooms with first paintings
  '/van-gogh/en-GB',
  '/van-gogh/en-GB/room-1',
  '/van-gogh/en-GB/room-1/painting-1-1',
  '/van-gogh/en-GB/room-2',
  '/van-gogh/en-GB/room-2/painting-2-4',
  '/van-gogh/en-GB/room-3',
  '/van-gogh/en-GB/room-3/painting-3-21',
  '/van-gogh/zh-TW',
  '/van-gogh/zh-TW/room-1',
  '/van-gogh/zh-TW/room-1/painting-1-1',
  '/van-gogh/zh-TW/room-2',
  '/van-gogh/zh-TW/room-2/painting-2-4',
  '/van-gogh/zh-CN',
  '/van-gogh/zh-CN/room-1',
  '/van-gogh/zh-CN/room-1/painting-1-1',
  '/van-gogh/zh-CN/room-2',
  '/van-gogh/zh-CN/room-2/painting-2-4'
];

// Cache state tracking
let currentLocale = 'en-GB';
let currentPosition = null; // { roomId, paintingId }
let cachedData = new Map(); // locale -> room data
let isCachingInProgress = new Set(); // Track ongoing caching operations
let fullyCachedLocales = new Set(); // Track which locales have been fully cached

// Persistent storage keys
const CACHE_METADATA_KEY = 'van-gogh-cache-metadata-v4';

// Persistent cache metadata functions
async function loadCacheMetadata() {
  try {
    const cache = await caches.open(DATA_CACHE);
    const metadataResponse = await cache.match(CACHE_METADATA_KEY);
    
    if (metadataResponse) {
      const metadata = await metadataResponse.json();
      fullyCachedLocales = new Set(metadata.fullyCachedLocales || []);
      console.log(`📋 SW: Loaded persistent cache metadata - fully cached locales:`, Array.from(fullyCachedLocales));
      return metadata;
    }
  } catch (error) {
    console.warn('⚠️ SW: Failed to load cache metadata:', error);
  }
  
  return { fullyCachedLocales: [] };
}

async function saveCacheMetadata() {
  try {
    const cache = await caches.open(DATA_CACHE);
    const metadata = {
      fullyCachedLocales: Array.from(fullyCachedLocales),
      lastUpdated: Date.now()
    };
    
    const response = new Response(JSON.stringify(metadata), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put(CACHE_METADATA_KEY, response);
    console.log(`💾 SW: Saved cache metadata - fully cached locales:`, metadata.fullyCachedLocales);
  } catch (error) {
    console.warn('⚠️ SW: Failed to save cache metadata:', error);
  }
}

self.addEventListener('install', (event) => {
  console.log('🔄 SW: Installing data-first service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache static assets immediately
        const assetsCache = await caches.open(ASSETS_CACHE);
        await assetsCache.addAll(STATIC_ASSETS);
        console.log('✅ SW: Static assets cached');

        // Cache room data for all locales
        for (const locale of SUPPORTED_LOCALES) {
          try {
            const roomDataUrl = `/van-gogh-assets/${locale}_rooms.json`;
            await assetsCache.add(roomDataUrl);
            console.log(`✅ SW: Cached room data for ${locale}`);
          } catch (error) {
            console.warn(`⚠️ SW: Failed to cache room data for ${locale}:`, error);
          }
        }

        // Cache basic pages for offline navigation (only if online)
        if (navigator.onLine) {
          const pageCache = await caches.open(CACHE_NAME);
          for (const page of PAGES_TO_CACHE) {
            try {
              await pageCache.add(page);
              console.log(`✅ SW: Cached page: ${page}`);
            } catch (error) {
              console.warn(`⚠️ SW: Failed to cache page ${page}:`, error);
            }
          }
        }

        self.skipWaiting();
      } catch (error) {
        console.error('❌ SW: Installation failed:', error);
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  console.log('🔄 SW: Activating data-first service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Load persistent cache metadata FIRST
        await loadCacheMetadata();
        
        // Clean up old caches
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name !== CACHE_NAME && 
          name !== DATA_CACHE && 
          name !== ASSETS_CACHE &&
          name !== STATIC_CACHE
        );
        
        await Promise.all(
          oldCaches.map(cacheName => caches.delete(cacheName))
        );
        
        if (oldCaches.length > 0) {
          console.log('🗑️ SW: Cleaned up old caches:', oldCaches);
        }

        self.clients.claim();
        console.log('✅ SW: Data-first service worker activated');

        // Only start smart asset caching if default locale not already fully cached
        if (!fullyCachedLocales.has('en-GB')) {
          await smartCacheAssets('en-GB');
        } else {
          console.log('✅ SW: Default locale en-GB already fully cached, skipping initial caching');
        }
      } catch (error) {
        console.error('❌ SW: Activation failed:', error);
      }
    })()
  );
});

// Smart asset caching function (no HTML pages, only data and assets)
async function smartCacheAssets(locale, position = null) {
  // Check if this locale is already fully cached
  if (fullyCachedLocales.has(locale)) {
    console.log(`✅ SW: Locale ${locale} already fully cached, skipping...`);
    return;
  }

  // Prevent duplicate caching operations for the same locale
  const cacheKey = locale; // Simplified key - just use locale
  if (isCachingInProgress.has(cacheKey)) {
    console.log(`🔄 SW: Caching already in progress for ${locale}, skipping...`);
    return;
  }
  
  isCachingInProgress.add(cacheKey);
  console.log(`🚀 SW: Starting smart asset caching for ${locale} at position:`, position);
  
  try {
    const assetsCache = await caches.open(ASSETS_CACHE);
    const dataCache = await caches.open(DATA_CACHE);
    
    // Check if we already have the room data cached
    let roomData = cachedData.get(locale);
    let roomDataResponse;
    
    if (!roomData) {
      // Try to get from cache first
      roomDataResponse = await dataCache.match(`/van-gogh-assets/${locale}_rooms.json`);
      
      if (roomDataResponse) {
        console.log(`📋 SW: Using cached room data for ${locale}`);
        roomData = await roomDataResponse.json();
        cachedData.set(locale, roomData);
      } else {
        // Only fetch from network if we're online
        if (navigator.onLine) {
          console.log(`🌐 SW: Fetching room data for ${locale} from network`);
          roomDataResponse = await fetch(`/van-gogh-assets/${locale}_rooms.json`);
          if (!roomDataResponse.ok) {
            throw new Error(`Failed to fetch room data for ${locale}`);
          }
          
          // Clone the response BEFORE consuming it
          const roomDataResponseClone = roomDataResponse.clone();
          roomData = await roomDataResponse.json();
          
          // Cache the JSON data using the cloned response
          await dataCache.put(`/van-gogh-assets/${locale}_rooms.json`, roomDataResponseClone);
          cachedData.set(locale, roomData);
        } else {
          console.log(`📴 SW: Offline mode - no cached room data for ${locale}`);
          return;
        }
      }
    } else {
      console.log(`📋 SW: Using in-memory room data for ${locale}`);
    }
    
    const assetsToCache = [];
    
    // Generate all asset URLs
    roomData.rooms.forEach((room, roomIndex) => {
      const roomNumber = roomIndex + 1;
      const roomId = `room-${roomNumber}`;
      
      // Add room audio (AAC format - smaller, better quality)
      assetsToCache.push(`/van-gogh-assets/${locale}.${roomId}.aac`);
      
      // Add room image if exists
      if (room.roomImage) {
        assetsToCache.push(`/van-gogh-assets/${room.roomImage.url}`);
      }
      
      // Add painting audio and images
      room.paintings.forEach((painting) => {
        const paintingId = `painting-${roomNumber}-${painting.paintingNumber}`;
        assetsToCache.push(`/van-gogh-assets/${locale}.${paintingId}.aac`);
        
        if (painting.image) {
          assetsToCache.push(`/van-gogh-assets/${painting.image.url}`);
        }
      });
    });

    console.log(`📋 SW: Generated ${assetsToCache.length} assets for ${locale}`);

    // Check how many assets are already cached
    const cachedAssets = await Promise.all(
      assetsToCache.map(async (asset) => {
        const cached = await assetsCache.match(asset);
        return cached ? asset : null;
      })
    );
    
    const alreadyCachedCount = cachedAssets.filter(Boolean).length;
    const uncachedAssets = assetsToCache.filter((asset, index) => !cachedAssets[index]);
    
    console.log(`📊 SW: ${alreadyCachedCount}/${assetsToCache.length} assets already cached for ${locale}`);
    
    // If all assets are already cached, mark locale as fully cached
    if (uncachedAssets.length === 0) {
      fullyCachedLocales.add(locale);
      await saveCacheMetadata(); // Persist the state
      console.log(`✅ SW: All assets for ${locale} already cached - marking as fully cached`);
      
      // Notify clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'ASSET_CACHE_COMPLETE',
            locale,
            totalAssets: assetsToCache.length,
            roomData: roomData
          });
        });
      });
      
      return;
    }

    // Calculate priorities based on current position for uncached assets only
    const prioritizedAssets = calculateAssetPriorities(uncachedAssets, position, locale);

    // Cache uncached items with priority
    await cacheAssetsWithPriority(prioritizedAssets, locale);
    
    // Check if we've now cached everything
    const finalCachedAssets = await Promise.all(
      assetsToCache.map(async (asset) => {
        const cached = await assetsCache.match(asset);
        return cached ? asset : null;
      })
    );
    
    const finalCachedCount = finalCachedAssets.filter(Boolean).length;
    
    if (finalCachedCount === assetsToCache.length) {
      fullyCachedLocales.add(locale);
      await saveCacheMetadata(); // Persist the state
      console.log(`✅ SW: Locale ${locale} is now fully cached (${finalCachedCount}/${assetsToCache.length} assets)`);
    } else {
      console.log(`📊 SW: Partial caching complete for ${locale} (${finalCachedCount}/${assetsToCache.length} assets)`);
    }
    
    console.log(`✅ SW: Smart asset caching completed for ${locale}`);
    
    // Notify clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'ASSET_CACHE_COMPLETE',
          locale,
          totalAssets: assetsToCache.length,
          roomData: roomData
        });
      });
    });

  } catch (error) {
    console.error(`❌ SW: Smart asset caching failed for ${locale}:`, error);
  } finally {
    // Remove from in-progress set
    isCachingInProgress.delete(cacheKey);
  }
}

// Calculate asset priorities based on user position
function calculateAssetPriorities(assets, position, locale) {
  const priorities = new Map();
  
  assets.forEach(asset => {
    let priority = 0;
    
    // Base priority
    priority += 10;
    
    // Current position gets highest priority
    if (position && asset.includes(position.roomId)) {
      priority += 100;
      if (position.paintingId && asset.includes(position.paintingId)) {
        priority += 50;
      }
    }
    
    // Adjacent rooms get high priority
    if (position) {
      const currentRoomNum = parseInt(position.roomId.split('-')[1]);
      const assetRoomMatch = asset.match(/room-(\d+)/);
      if (assetRoomMatch) {
        const assetRoomNum = parseInt(assetRoomMatch[1]);
        const distance = Math.abs(assetRoomNum - currentRoomNum);
        if (distance === 1) priority += 80;
        else if (distance === 2) priority += 60;
        else if (distance === 3) priority += 40;
      }
    }
    
    // Room audio gets higher priority than painting audio
    if (!asset.includes('painting-')) {
      priority += 20;
    }
    
    // Images get lower priority than audio
    if (asset.includes('.png') || asset.includes('.jpg')) {
      priority -= 10;
    }
    
    priorities.set(asset, priority);
  });
  
  return priorities;
}

// Cache assets with priority-based batching
async function cacheAssetsWithPriority(assetPriorities, locale) {
  const assetsCache = await caches.open(ASSETS_CACHE);
  
  // Sort by priority (highest first)
  const sortedAssets = Array.from(assetPriorities.entries())
    .sort((a, b) => b[1] - a[1]);
  
  console.log(`🎯 SW: Caching ${sortedAssets.length} new assets for ${locale}`);
  
  // Cache high-priority items first (first 30 assets)
  const highPriorityAssets = sortedAssets.slice(0, 30);
  
  // Cache high-priority items immediately
  await Promise.allSettled(
    highPriorityAssets.map(async ([url, priority]) => {
      try {
        // Only fetch if online (we already know it's not cached)
        if (navigator.onLine) {
          const response = await fetch(url);
          if (response.ok) {
            await assetsCache.put(url, response);
            console.log(`✅ SW: Cached high-priority asset: ${url} (priority: ${priority})`);
          }
        } else {
          console.log(`📴 SW: Skipping network fetch for ${url} (offline)`);
        }
      } catch (error) {
        console.warn(`⚠️ SW: Failed to cache asset ${url}:`, error);
      }
    })
  );
  
  // Cache remaining items in background (only if online)
  if (navigator.onLine && sortedAssets.length > 30) {
    setTimeout(async () => {
      const remainingAssets = sortedAssets.slice(30);
      
      // Cache in smaller batches to avoid overwhelming the browser
      const batchSize = 10;
      
      for (let i = 0; i < remainingAssets.length; i += batchSize) {
        const batch = remainingAssets.slice(i, i + batchSize);
        await Promise.allSettled(
          batch.map(async ([url, priority]) => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await assetsCache.put(url, response);
              }
            } catch (error) {
              console.warn(`⚠️ SW: Failed to cache background asset ${url}:`, error);
            }
          })
        );
      }
      
      console.log(`✅ SW: Background asset caching completed for ${locale}`);
    }, 1000);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip HEAD requests as they're not supported by Cache API
  if (request.method === 'HEAD') {
    return;
  }

  // Add debug logging for offline mode
  const isOffline = !navigator.onLine;
  if (isOffline) {
    console.log('🔄 SW: Offline request for:', request.url);
  }

  // Handle van-gogh assets and data
  if (url.pathname.startsWith('/van-gogh-assets/')) {
    event.respondWith(handleAssetRequest(request));
    return;
  }

  // Handle Next.js static assets (CSS, JS, etc.) - Cache-first for offline support
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.startsWith('/_next/') ||
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js') ||
      url.pathname.includes('/favicon') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.includes('/chunks/') ||
      url.pathname.match(/\.(woff2?|ttf|eot)$/)) {
    event.respondWith(handleStaticAssets(request));
    return;
  }

  // Handle van-gogh pages - ALWAYS intercept to serve from cache for SPA-like experience
  if (url.pathname.startsWith('/van-gogh')) {
    event.respondWith(handleVanGoghNavigation(request));
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(request).catch(async () => {
      // If network fails, try cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return appropriate 404 response
      return new Response('Request failed and no cache available', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});



// Handle ALL van-gogh navigation (online/offline) - Cache-first for SPA-like experience
async function handleVanGoghNavigation(request) {
  const url = new URL(request.url);
  const isOffline = !navigator.onLine;
  
  console.log(`🚀 SW: Intercepting van-gogh navigation for: ${url.pathname} (${isOffline ? 'offline' : 'online'})`);
  
  // Extract locale from URL path and detect locale changes
  const pathParts = url.pathname.split('/');
  if (pathParts.length >= 3) {
    const newLocale = pathParts[2];
    if (SUPPORTED_LOCALES.includes(newLocale) && newLocale !== currentLocale) {
      console.log(`🌍 SW: Locale change detected: ${currentLocale} → ${newLocale}`);
      currentLocale = newLocale;
      
      // Trigger smart asset caching for the new locale in the background
      if (!isOffline) {
        smartCacheAssets(newLocale, currentPosition).catch(error => {
          console.warn('⚠️ SW: Background asset caching failed for new locale:', error);
        });
      }
    }
  }
  
  const cache = await caches.open(CACHE_NAME);
  
  // ALWAYS try cache first for instant SPA-like navigation (exact match only)
  let cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log(`⚡ SW: Serving cached page: ${url.pathname}`);
    return cachedResponse;
  }
  
  // If online and exact page not cached, fetch from network and cache for future
  if (!isOffline) {
    try {
      console.log(`🌐 SW: Cache miss - fetching from network: ${url.pathname}`);
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful responses for future instant access
        const responseClone = networkResponse.clone();
        cache.put(request, responseClone);
        console.log(`✅ SW: Cached new page for future SPA navigation: ${url.pathname}`);
        return networkResponse;
      }
    } catch (error) {
      console.warn(`⚠️ SW: Network fetch failed for ${url.pathname}:`, error);
    }
  }
  
  // Only use fallbacks when offline or network fails
  console.log(`📴 SW: Network unavailable, trying fallbacks for: ${url.pathname}`);
  
  // Try to get a similar page (same locale, different room/painting) - ONLY when offline
  if (pathParts.length >= 3) {
    // Extract locale from URL path (e.g., /van-gogh/en-GB/room-2 -> en-GB)
    const locale = pathParts[2];
    
    // Try fallback pages for this locale in order of preference
    const fallbackUrls = [
      `/van-gogh/${locale}/room-1`,
      `/van-gogh/${locale}`,
    ];
    
    for (const fallbackUrl of fallbackUrls) {
      cachedResponse = await cache.match(fallbackUrl);
      if (cachedResponse) {
        console.log(`⚡ SW: Serving offline fallback: ${fallbackUrl} for ${url.pathname}`);
        return cachedResponse;
      }
    }
  }
  
  // Try to get a cached version of the default locale as last resort
  cachedResponse = await cache.match('/van-gogh/en-GB');
  if (cachedResponse) {
    console.log(`⚡ SW: Serving default locale offline fallback for ${url.pathname}`);
    return cachedResponse;
  }
  
  // Offline fallback or network error
  console.log(`📴 SW: Serving offline page for: ${url.pathname}`);
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Van Gogh Digital Guide - ${isOffline ? 'Offline' : 'Error'}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 50px; text-align: center; background: #f5f5f5; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #333; margin-bottom: 20px; }
          p { color: #666; margin-bottom: 30px; }
          button { background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; }
          button:hover { background: #0056CC; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${isOffline ? '📴 Offline Mode' : '⚠️ Page Not Available'}</h1>
          <p>${isOffline ? 'You\'re currently offline. Some pages may not be available.' : 'This page couldn\'t be loaded. Please try again.'}</p>
          <button onclick="window.location.reload()">Retry</button>
          <br><br>
          <a href="/van-gogh/en-GB" style="color: #007AFF; text-decoration: none;">← Return to Van Gogh Guide</a>
        </div>
      </body>
    </html>
  `, {
    status: isOffline ? 200 : 500,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Handle Next.js static assets (CSS, JS, etc.) for offline support
async function handleStaticAssets(request) {
  const staticCache = await caches.open(STATIC_CACHE);
  const isOffline = !navigator.onLine;
  
  console.log(`🔧 SW: Handling static asset: ${request.url} (${isOffline ? 'offline' : 'online'})`);
  
  // Always try cache first for static assets (they're immutable)
  const cachedResponse = await staticCache.match(request);
  if (cachedResponse) {
    console.log(`⚡ SW: Serving cached static asset: ${request.url}`);
    return cachedResponse;
  }
  
  // If online and not cached, fetch and cache
  if (!isOffline) {
    try {
      console.log(`🌐 SW: Fetching static asset from network: ${request.url}`);
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful responses (Next.js static assets are immutable)
        const responseClone = networkResponse.clone();
        staticCache.put(request, responseClone);
        console.log(`✅ SW: Cached static asset: ${request.url}`);
        return networkResponse;
      }
    } catch (error) {
      console.warn(`⚠️ SW: Failed to fetch static asset ${request.url}:`, error);
    }
  }
  
  // Offline fallback - return a basic response to prevent errors
  console.log(`📴 SW: Static asset not available offline: ${request.url}`);
  
  // For CSS files, return empty CSS to prevent styling breaks
  if (request.url.endsWith('.css')) {
    return new Response('/* Offline - CSS not available */', {
      status: 200,
      headers: { 'Content-Type': 'text/css' }
    });
  }
  
  // For JS files, return empty script to prevent JS errors
  if (request.url.endsWith('.js')) {
    return new Response('// Offline - JS not available', {
      status: 200,
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
  
  // For other assets, return 404
  return new Response('Asset not available offline', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function handleAssetRequest(request) {
  // Skip HEAD requests as they're not supported by Cache API
  if (request.method === 'HEAD') {
    return fetch(request);
  }

  const assetsCache = await caches.open(ASSETS_CACHE);
  const dataCache = await caches.open(DATA_CACHE);
  
  // Try cache first for assets
  const cachedResponse = await assetsCache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Try data cache for JSON files
  const dataResponse = await dataCache.match(request);
  if (dataResponse) {
    return dataResponse;
  }

  // If not in cache, try network and cache the response (only if online)
  if (navigator.onLine) {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        // Cache in appropriate cache based on content type
        if (request.url.includes('.json')) {
          dataCache.put(request, networkResponse.clone());
        } else {
          assetsCache.put(request, networkResponse.clone());
        }
      }
      return networkResponse;
    } catch (error) {
      console.warn('⚠️ SW: Asset request failed:', request.url);
    }
  }
  
  // Return fallback for images
  if (request.url.includes('.png') || request.url.includes('.jpg')) {
    const fallbackResponse = await assetsCache.match('/van-gogh-assets/fallback-image.jpg');
    if (fallbackResponse) {
      return fallbackResponse;
    }
  }
  
  // Return fallback for audio (prefer AAC, fallback to MP3)
  if (request.url.includes('.mp3') || request.url.includes('.aac')) {
    // Try AAC fallback first (preferred format)
    const aacFallbackResponse = await assetsCache.match('/van-gogh-assets/silence.aac');
    if (aacFallbackResponse) {
      return aacFallbackResponse;
    }
    // Try MP3 fallback if AAC not available
    const mp3FallbackResponse = await assetsCache.match('/van-gogh-assets/mp3/silence.mp3');
    if (mp3FallbackResponse) {
      return mp3FallbackResponse;
    }
  }
  
  // If no fallback available, throw error
  throw new Error(`Asset not found and no fallback available: ${request.url}`);
}



// Debug function to log cache contents
async function logCacheContents() {
  try {
    const assetsCache = await caches.open(ASSETS_CACHE);
    const keys = await assetsCache.keys();
    console.log('📋 SW: Cached assets:', keys.map(req => req.url));
  } catch (error) {
    console.warn('⚠️ SW: Failed to log cache contents:', error);
  }
}

// Helper function to safely send message response
function sendMessageResponse(event, response) {
  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage(response);
  } else {
    // Fallback: try to send to all clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_RESPONSE',
          originalType: response.type || 'UNKNOWN',
          ...response
        });
      });
    });
  }
}

// Message handler for cache management
self.addEventListener('message', async (event) => {
  const { data } = event;
  
  try {
    switch (data.type) {
      case 'UPDATE_POSITION':
        // Update current position and trigger smart caching
        currentPosition = data.position;
        currentLocale = data.locale || currentLocale;
        console.log('📍 SW: Position updated:', currentPosition, 'Locale:', currentLocale);
        
        // Trigger smart asset caching for current locale and position
        await smartCacheAssets(currentLocale, currentPosition);
        
        sendMessageResponse(event, {
          success: true,
          message: `Smart asset caching triggered for ${currentLocale} at position ${JSON.stringify(currentPosition)}`
        });
        break;

      case 'GET_CACHED_DATA':
        // Return cached room data for client-side rendering
        if (data.locale && SUPPORTED_LOCALES.includes(data.locale)) {
          const dataCache = await caches.open(DATA_CACHE);
          const roomDataResponse = await dataCache.match(`/van-gogh-assets/${data.locale}_rooms.json`);
          
          if (roomDataResponse) {
            const roomData = await roomDataResponse.json();
            sendMessageResponse(event, {
              success: true,
              roomData: roomData
            });
          } else {
            throw new Error('Room data not cached');
          }
        } else {
          throw new Error('Invalid locale provided');
        }
        break;

      case 'PURGE_CACHE':
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        
        // Reset cache tracking
        fullyCachedLocales.clear();
        cachedData.clear();
        await saveCacheMetadata(); // Persist the reset state
        
        sendMessageResponse(event, {
          success: true,
          message: 'All caches purged successfully'
        });
        break;

      case 'CHECK_CACHE_STATUS':
        const assetsCache = await caches.open(ASSETS_CACHE);
        const dataCache = await caches.open(DATA_CACHE);
        const staticCache = await caches.open(STATIC_CACHE);
        const assetKeys = await assetsCache.keys();
        const dataKeys = await dataCache.keys();
        const staticKeys = await staticCache.keys();
        
        sendMessageResponse(event, {
          success: true,
          assetCount: assetKeys.length,
          dataCount: dataKeys.length,
          staticCount: staticKeys.length,
          totalSize: assetKeys.length + dataKeys.length + staticKeys.length,
          currentLocale,
          currentPosition,
          fullyCachedLocales: Array.from(fullyCachedLocales)
        });
        break;

      default:
        throw new Error(`Unknown message type: ${data.type}`);
    }
  } catch (error) {
    console.error('❌ SW: Message handler error:', error);
    sendMessageResponse(event, {
      success: false,
      message: error.message
    });
  }
});

console.log('🎯 SW: Data-first Van Gogh service worker loaded');