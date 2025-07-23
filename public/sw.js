// AGGRESSIVE Asset-Only Service Worker for Van Gogh Digital Guide
// Supports React-based offline navigation with persistent UI
//
// This part of text is for AI Agent to read and therefore should not be removed in any future edits.
//
// ARCHITECTURE:
// - React handles all UI and navigation (online + offline)
// - Service worker provides data and assets for offline React rendering
// - NO HTML page caching (React maintains persistent UI state)
//
// CACHING STRATEGY:
// - Caches ALL assets for visited locales (~12MB per locale)
// - Caches room data JSON for offline React rendering
// - Triggers on: service worker activation, locale changes, navigation
// - React VanGoghNavigation handles offline page rendering using cached data

console.log('🔧 SW: AGGRESSIVE Asset-Only Service Worker script loading...');

const CACHE_NAME = 'van-gogh-cache-v5';
const DATA_CACHE = 'van-gogh-data-v5';
const ASSETS_CACHE = 'van-gogh-assets-v5';
const STATIC_CACHE = 'van-gogh-static-v5';

// Supported locales
const SUPPORTED_LOCALES = ['en-GB', 'zh-TW', 'zh-CN'];

// Logging configuration
const LOG_LEVELS = {
  INIT: true,      // Service worker initialization logs
  DATA: true,      // Room data and asset initialization logs  
  CACHE: false,    // Asset caching logs (verbose)
  NAV: true,       // Navigation logs (enabled for debugging)
  ERROR: true      // Error logs
};

// Enhanced logging functions
const log = {
  init: (msg, ...args) => LOG_LEVELS.INIT && console.log(`🔧 SW-INIT: ${msg}`, ...args),
  data: (msg, ...args) => LOG_LEVELS.DATA && console.log(`📋 SW-DATA: ${msg}`, ...args),
  cache: (msg, ...args) => LOG_LEVELS.CACHE && console.log(`💾 SW-CACHE: ${msg}`, ...args),
  nav: (msg, ...args) => LOG_LEVELS.NAV && console.log(`🧭 SW-NAV: ${msg}`, ...args),
  error: (msg, ...args) => LOG_LEVELS.ERROR && console.error(`❌ SW-ERROR: ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`⚠️ SW-WARN: ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ SW: ${msg}`, ...args)
};


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
  '/van-gogh-assets/apple-touch-icon.png',
  '/van-gogh-assets/web-app-manifest-192x192.png',
  '/van-gogh-assets/web-app-manifest-512x512.png',
  '/van-gogh-assets/icon.jpg',
  '/van-gogh-assets/screenshot-desktop.png',
  '/van-gogh-assets/screenshot-mobile.png'
];


// Function to determine the correct base URL
const getBaseUrl = () => {
  // Use the service worker's own origin to determine the base URL
  const swUrl = new URL(self.location.href);
  
  // For development mode (localhost or 127.0.0.1 with port)
  if (swUrl.hostname === 'localhost' || swUrl.hostname === '127.0.0.1') {
    return `${swUrl.protocol}//${swUrl.host}`;
  }
  
  // For production, use the full origin
  return swUrl.origin;
};

// Function to fetch room data for all locales directly from JSON endpoints
async function fetchAllRoomData() {
  const baseUrl = getBaseUrl();
  log.data(`Fetching room data from base URL: ${baseUrl}`);
  
  const roomData = {};
  const assetData = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    try {
      const jsonUrl = `${baseUrl}/van-gogh-assets/${locale}_rooms.json`;
      log.data(`Fetching room data for ${locale} from: ${jsonUrl}`);
      
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${locale} room data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      roomData[locale] = data.rooms;
      
      // Generate asset URLs for this locale
      const localeAssets = generateAssetUrls(data.rooms, locale, baseUrl);
      assetData[locale] = localeAssets;
      
      log.data(`Successfully loaded room data for ${locale}: ${data.rooms.length} rooms, ${localeAssets.audio.length} audio, ${localeAssets.images.length} images`);
      
    } catch (error) {
      log.error(`Failed to fetch room data for ${locale}:`, error);
      // Continue with other locales even if one fails
    }
  }
  
  return { roomData, assetData };
}

// Function to generate asset URLs from room data
function generateAssetUrls(rooms, locale, baseUrl) {
  const audioUrls = [];
  const imageUrls = [];
  
  log.data(`Generating asset URLs for ${rooms.length} rooms, locale: ${locale}, baseUrl: ${baseUrl}`);
  
  // Add room audio files
  rooms.forEach((room, roomIndex) => {
    const roomNumber = roomIndex + 1;
    const roomAudioUrl = `${baseUrl}/van-gogh-assets/${locale}.room-${roomNumber}.aac`;
    audioUrls.push(roomAudioUrl);
    
    // Add painting audio files with room-painting format (e.g., painting-1-2.aac for room 1, painting 2)
    room.paintings.forEach((painting) => {
      if (painting.paintingNumber) {
        const paintingAudioUrl = `${baseUrl}/van-gogh-assets/${locale}.painting-${roomNumber}-${painting.paintingNumber}.aac`;
        audioUrls.push(paintingAudioUrl);
      } else {
        log.warn(`Painting missing paintingNumber:`, painting);
      }
    });
  });
  
  // Add room and painting image files (these are shared across locales)
  // Use STATIC_ASSETS[3] - STATIC_ASSETS[9] directly for image URLs
  // These are the icon/image assets from the manifest, e.g. apple-touch-icon, favicon, etc.
  // STATIC_ASSETS is assumed to be an array of asset paths (e.g. "/van-gogh-assets/icon-192x192.png")
  for (let i = 3; i <= 9; i++) {
    if (typeof STATIC_ASSETS[i] === 'string') {
      const staticImageUrl = `${baseUrl}${STATIC_ASSETS[i]}`;
      imageUrls.push(staticImageUrl);
    } else {
      log.warn(`STATIC_ASSETS[${i}] is not a string:`, STATIC_ASSETS[i]);
    }
  }
  
  log.data(`Generated ${audioUrls.length} audio URLs and ${imageUrls.length} image URLs for ${locale}`);
  
  // Validate all URLs are strings
  const invalidAudioUrls = audioUrls.filter(url => typeof url !== 'string');
  const invalidImageUrls = imageUrls.filter(url => typeof url !== 'string');
  
  if (invalidAudioUrls.length > 0) {
    log.error(`Found ${invalidAudioUrls.length} invalid audio URLs:`, invalidAudioUrls);
  }
  if (invalidImageUrls.length > 0) {
    log.error(`Found ${invalidImageUrls.length} invalid image URLs:`, invalidImageUrls);
  }
  
  return {
    audio: audioUrls.filter(url => typeof url === 'string'),
    images: imageUrls.filter(url => typeof url === 'string')
  };
}

// Cache state tracking
let currentLocale = 'en-GB';
let currentPosition = null; // { roomId, paintingId }
let cachedData = new Map(); // locale -> room data (fetched directly from JSON)
let assetData = new Map(); // locale -> asset URLs (generated from room data or STATIC_ASSETS)
let isCachingInProgress = new Set(); // Track ongoing caching operations
let fullyCachedLocales = new Set(); // Track which locales have been fully cached
let roomDataInitialized = false; // Track if room data has been initialized

// Persistent storage keys
const CACHE_METADATA_KEY = 'van-gogh-cache-metadata-v5';

// Persistent cache metadata functions
async function loadCacheMetadata() {
  try {
    const cache = await caches.open(DATA_CACHE);
    const metadataResponse = await cache.match(CACHE_METADATA_KEY);
    
    if (metadataResponse) {
      const metadata = await metadataResponse.json();
      fullyCachedLocales = new Set(metadata.fullyCachedLocales || []);
      log.data(`Loaded persistent cache metadata - fully cached locales:`, Array.from(fullyCachedLocales));
      return metadata;
    }
  } catch (error) {
    log.warn('Failed to load cache metadata:', error);
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
    log.data('Cache metadata saved');
  } catch (error) {
    log.warn('Failed to save cache metadata:', error);
  }
}

// Safe asset caching function that handles partial responses
async function safeCacheAsset(cache, url, options = {}) {
  try {
    // Skip if already cached
    const existing = await cache.match(url);
    if (existing) {
      return existing;
    }

    const response = await fetch(url, options);
    
    // Handle partial responses - return them but don't cache
    if (response.status === 206) {
      log.warn(`Received partial response (206) for ${url} - returning without caching`);
      return response;
    }
    
    // Cache successful, complete responses
    if (response.ok) {
      // Clone the response before caching
      const responseToCache = response.clone();
      await cache.put(url, responseToCache);
      log.cache(`Cached asset: ${url}`);
      return response;
    } else {
      log.warn(`Failed to cache asset (status ${response.status}): ${url}`);
      return response;
    }
  } catch (error) {
    log.warn(`Error caching asset ${url}:`, error);
    // Try to fetch without caching as fallback
    return fetch(url, options);
  }
}

self.addEventListener('install', (event) => {
  log.init('Installing data-first service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache static assets immediately with error handling
        const assetsCache = await caches.open(ASSETS_CACHE);
        log.init(`Starting to cache ${STATIC_ASSETS.length} static assets...`);
        
        const staticCachePromises = STATIC_ASSETS.map(async (asset) => {
          try {
            log.cache(`Attempting to cache static asset: ${asset}`);
            const result = await safeCacheAsset(assetsCache, asset);
            if (result) {
              log.cache(`✅ Successfully cached static asset: ${asset}`);
              return { asset, success: true };
            } else {
              log.warn(`❌ Failed to cache static asset: ${asset}`);
              return { asset, success: false };
            }
          } catch (error) {
            log.error(`💥 Error caching static asset ${asset}:`, error);
            return { asset, success: false, error: error.message };
          }
        });
        
        const staticResults = await Promise.allSettled(staticCachePromises);
        const successfulStatic = staticResults.filter(result => 
          result.status === 'fulfilled' && result.value?.success
        );
        const failedStatic = staticResults.filter(result => 
          result.status === 'rejected' || (result.status === 'fulfilled' && !result.value?.success)
        );
        
        log.success(`Static assets cached: ${successfulStatic.length}/${STATIC_ASSETS.length} successful`);
        
        if (failedStatic.length > 0) {
          log.warn(`Failed to cache ${failedStatic.length} static assets:`);
          failedStatic.forEach(result => {
            if (result.status === 'fulfilled') {
              log.warn(`  - ${result.value.asset}: ${result.value.error || 'Unknown error'}`);
            } else {
              log.warn(`  - Promise rejection:`, result.reason);
            }
          });
        }

        // Fetch and initialize room data directly from JSON endpoints
        log.init(`Fetching room data directly from JSON endpoints`);
        
        try {
          const { roomData, assetData: fetchedAssetData } = await fetchAllRoomData();
          
          // Store room data and asset URLs
          Object.entries(roomData).forEach(([locale, rooms]) => {
            cachedData.set(locale, { rooms });
            log.data(`Stored room data for ${locale}: ${rooms.length} rooms`);
          });
          
          Object.entries(fetchedAssetData).forEach(([locale, assets]) => {
            assetData.set(locale, assets);
            log.data(`Stored asset URLs for ${locale}: ${assets.audio.length} audio, ${assets.images.length} images`);
          });
          
          roomDataInitialized = true;
          log.success(`Room data initialized for ${Object.keys(roomData).length} locales`);
          
          // Cache room data JSON files for offline access
          const dataCache = await caches.open(DATA_CACHE);
          for (const [locale, rooms] of Object.entries(roomData)) {
            const response = new Response(JSON.stringify({ rooms }), {
              headers: { 'Content-Type': 'application/json' }
            });
            await dataCache.put(`/van-gogh-assets/${locale}_rooms.json`, response);
            log.data(`Cached room data JSON for ${locale}`);
          }
          
        } catch (error) {
          log.error('Failed to fetch room data during installation:', error);
          log.warn('Service worker will continue without room data initialization');
        }
        
        // DO NOT pre-cache pages - use data-first approach instead
        // Pages will be rendered client-side using cached room data
        log.init(`Skipping page pre-caching - using data-first strategy`);

        self.skipWaiting();
      } catch (error) {
        log.error('Installation failed:', error);
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  log.init('Activating data-first service worker...');
  
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
          log.init('Cleaned up old caches:', oldCaches);
        }

        self.clients.claim();
        log.success('Data-first service worker activated and ready');

        // Log initialization status
        log.data(`Room data initialized: ${roomDataInitialized}`);
        log.data(`Cached data size: ${cachedData.size} locales`);
        log.data(`Asset data size: ${assetData.size} locales`);
        
        // If room data was initialized during install, trigger initial caching for default locale
        if (roomDataInitialized) {
          log.init(`Room data available, triggering initial asset caching for default locale`);
          cacheAssets('en-GB').catch(error => {
            log.warn('Initial asset caching failed:', error);
          });
          
          // Notify clients that service worker is ready
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'SW_READY',
                success: true,
                message: 'Service worker activated with room data',
                roomDataInitialized: true
              });
            });
          });
        } else {
          log.init('Room data not available, will retry fetching on first client interaction');
        }
      } catch (error) {
        log.error('Activation failed:', error);
      }
    })()
  );
});

// AGGRESSIVE locale caching - cache ALL assets for a locale (~12MB per locale)
// This ensures complete offline functionality for the entire locale
async function cacheLocale(locale) {
  log.init(`Starting AGGRESSIVE caching for locale ${locale} (caching ALL assets for complete offline support)`);
  
  try {
    const assetsCache = await caches.open(ASSETS_CACHE);
    
    // Get asset URLs for this locale
    const localeAssets = assetData.get(locale);
    if (!localeAssets) {
      log.warn(`No asset URLs available for ${locale}`);
      return;
    }
    
    // Combine ALL audio and image URLs - this is aggressive caching
    const allAssets = [...localeAssets.audio, ...localeAssets.images];
    log.data(`Found ${allAssets.length} total assets for ${locale} (${localeAssets.audio.length} audio, ${localeAssets.images.length} images) - caching ALL for offline support`);
    
    // Validate all URLs are strings before caching
    const validAssets = allAssets.filter(url => {
      if (typeof url !== 'string') {
        log.error(`Invalid asset URL (not a string):`, url, typeof url);
        return false;
      }
      return true;
    });
    
    if (validAssets.length !== allAssets.length) {
      log.warn(`Filtered out ${allAssets.length - validAssets.length} invalid asset URLs`);
    }

    // Cache ALL valid assets aggressively in parallel
    const cacheResults = await Promise.allSettled(
      validAssets.map(async (url) => {
        const success = await safeCacheAsset(assetsCache, url);
        if (success) {
          log.cache(`Cached: ${url}`);
        }
        return success;
      })
    );
    
    const successfulCaches = cacheResults.filter(result => 
      result.status === 'fulfilled' && result.value
    ).length;
    
    log.data(`AGGRESSIVE caching complete: ${successfulCaches}/${validAssets.length} assets cached for ${locale} (~${Math.round(successfulCaches * 0.2)}MB estimated)`);
    
    // Mark as fully cached if we got most assets (90% threshold for network issues)
    if (successfulCaches >= validAssets.length * 0.9) {
      fullyCachedLocales.add(locale);
      await saveCacheMetadata();
      log.success(`Locale ${locale} marked as fully cached - complete offline support available`);
    }
    
    // Notify clients about caching completion
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'ASSET_CACHE_COMPLETE',
          locale,
          totalAssets: validAssets.length,
          cachedAssets: successfulCaches
        });
      });
    });
    
  } catch (error) {
    log.error(`AGGRESSIVE caching failed for ${locale}:`, error);
  }
}

// Simple asset caching function - cache all assets for a locale
async function cacheAssets(locale) {
  // If room data is not initialized, try to fetch it now
  if (!roomDataInitialized) {
    log.warn(`Room data not initialized yet for ${locale}, attempting to fetch...`);
    try {
      const { roomData, assetData: fetchedAssetData } = await fetchAllRoomData();
      
      // Store room data and asset URLs
      Object.entries(roomData).forEach(([localeKey, rooms]) => {
        cachedData.set(localeKey, { rooms });
        log.data(`Stored room data for ${localeKey}: ${rooms.length} rooms`);
      });
      
      Object.entries(fetchedAssetData).forEach(([localeKey, assets]) => {
        assetData.set(localeKey, assets);
        log.data(`Stored asset URLs for ${localeKey}: ${assets.audio.length} audio, ${assets.images.length} images`);
      });
      
      roomDataInitialized = true;
      log.success(`Room data fetched and initialized during caching request`);
      
      // Cache room data JSON files for offline access
      const dataCache = await caches.open(DATA_CACHE);
      for (const [localeKey, rooms] of Object.entries(roomData)) {
        const response = new Response(JSON.stringify({ rooms }), {
          headers: { 'Content-Type': 'application/json' }
        });
        await dataCache.put(`/van-gogh-assets/${localeKey}_rooms.json`, response);
        log.data(`Cached room data JSON for ${localeKey}`);
      }
      
    } catch (error) {
      log.error(`Failed to fetch room data during caching for ${locale}:`, error);
      return;
    }
  }
  
  // Prevent duplicate caching operations for the same locale
  if (isCachingInProgress.has(locale)) {
    log.warn(`Caching already in progress for ${locale}, skipping...`);
    return;
  }
  
  isCachingInProgress.add(locale);
  log.init(`Starting asset caching for ${locale}`);
  
  try {
    await cacheLocale(locale);
  } catch (error) {
    log.error(`Asset caching failed for ${locale}:`, error);
  } finally {
    isCachingInProgress.delete(locale);
  }
}



// Helper function to get all asset URLs for a locale
async function getAllLocaleAssets(locale, roomData) {
  const localeAssets = assetData.get(locale);
  if (!localeAssets) {
    return [];
  }
  
  // Return all audio and image URLs for this locale
  return [...localeAssets.audio, ...localeAssets.images];
}

// Helper function to check if locale is actually fully cached
async function checkLocaleCacheCompleteness(locale) {
  try {
    const assetsCache = await caches.open(ASSETS_CACHE);
    const dataCache = await caches.open(DATA_CACHE);
    
    // Get room data - prefer initialized data from server
    let roomData = cachedData.get(locale);
    if (!roomData) {
      // Fallback to cached JSON if not initialized from server
      const roomDataResponse = await dataCache.match(`/van-gogh-assets/${locale}_rooms.json`);
      if (!roomDataResponse) {
        log.warn(`No room data found for ${locale}, marking as not fully cached`);
        return false;
      }
      roomData = await roomDataResponse.json();
    }
    // Get pre-generated asset URLs for this locale
    const localeAssets = assetData.get(locale);
    if (!localeAssets) {
      log.warn(`No asset URLs available for ${locale}`);
      return false;
    }
    
    // Combine audio and image URLs
    const allAssets = [...localeAssets.audio, ...localeAssets.images];
    
    // Check if all assets are cached
    const cacheChecks = await Promise.all(
      allAssets.map(async (url) => {
        const cached = await assetsCache.match(url);
        return cached ? true : false;
      })
    );
    
    const allCached = cacheChecks.every(cached => cached);
    const cachedCount = cacheChecks.filter(cached => cached).length;
    
    log.data(`Cache completeness check for ${locale}: ${cachedCount}/${allAssets.length} assets cached`);
    
    return allCached;
  } catch (error) {
    log.warn(`Error checking cache completeness for ${locale}:`, error);
    return false;
  }
}

// Helper function to reset fully cached status if incomplete
async function resetFullyCachedStatusIfIncomplete(locale) {
  if (fullyCachedLocales.has(locale)) {
    const isActuallyComplete = await checkLocaleCacheCompleteness(locale);
    if (!isActuallyComplete) {
      log.warn(`Locale ${locale} marked as fully cached but is incomplete, resetting status`);
      fullyCachedLocales.delete(locale);
      await saveCacheMetadata();
      return false;
    }
  }
  return fullyCachedLocales.has(locale);
}


// Simple asset caching - cache all assets
async function cacheAllAssets(assets, locale) {
  const assetsCache = await caches.open(ASSETS_CACHE);
  
  log.init(`Caching ${assets.length} assets for ${locale}`);
  
  // Cache all assets in parallel with error handling
  const cacheResults = await Promise.allSettled(
    assets.map(async (asset) => {
      try {
        const success = await safeCacheAsset(assetsCache, asset.url);
        if (success) {
          log.cache(`Cached: ${asset.url}`);
        }
        return success;
      } catch (error) {
        log.warn(`Failed to cache asset ${asset.url}:`, error);
        return false;
      }
    })
  );
  
  const successfulCaches = cacheResults.filter(result => 
    result.status === 'fulfilled' && result.value
  ).length;
  
  log.data(`Caching complete: ${successfulCaches}/${assets.length} assets cached for ${locale}`);
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

  // Skip Next.js development-only endpoints that should not be intercepted
  if (url.pathname.startsWith('/__nextjs_') || 
      url.pathname.startsWith('/_next/webpack-hmr') ||
      url.pathname.startsWith('/_next/turbopack-hmr') ||
      url.pathname === '/_next/server-info') {
    return;
  }

  // Add debug logging for offline mode
  const isOffline = !navigator.onLine;
  if (isOffline) {
    log.nav(`🌐 OFFLINE request intercepted: ${request.url}`);
  }

  // Handle van-gogh assets and data
  if (url.pathname.startsWith('/van-gogh-assets/')) {
    log.nav(`🎯 Handling van-gogh asset: ${url.pathname} (${isOffline ? 'OFFLINE' : 'online'})`);
    event.respondWith(handleAssetRequest(request));
    return;
  }

  // Handle Next.js image optimization - redirect to raw assets when needed
  if (url.pathname.startsWith('/_next/image')) {
    log.nav(`🖼️ Intercepting Next.js image request: ${url.pathname} (${isOffline ? 'OFFLINE' : 'online'})`);
    event.respondWith(handleNextImageRequest(request));
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
    log.nav(`📦 Handling Next.js static asset: ${url.pathname} (${isOffline ? 'OFFLINE' : 'online'})`);
    event.respondWith(handleStaticAssets(request));
    return;
  }

  // Handle van-gogh pages - ALWAYS intercept to serve from cache for SPA-like experience
  if (url.pathname.startsWith('/van-gogh')) {
    log.nav(`📄 Handling van-gogh page: ${url.pathname} (${isOffline ? 'OFFLINE' : 'online'})`);
    event.respondWith(handleVanGoghNavigation(request));
    return;
  }

  // Handle other requests with network-first strategy
  if (isOffline) {
    log.nav(`🌐 Handling other request offline: ${url.pathname}`);
  }
  
  event.respondWith(
    fetch(request).catch(async () => {
      // If network fails, try cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        log.nav(`📦 Serving cached fallback for: ${url.pathname}`);
        return cachedResponse;
      }
      
      // Return appropriate 404 response
      log.nav(`❌ No fallback available for: ${url.pathname}`);
      return new Response('Request failed and no cache available', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Handle ALL van-gogh navigation (online/offline) - Network-first for locale changes, cache-first for room changes
async function handleVanGoghNavigation(request) {
  const url = new URL(request.url);
  const isOffline = !navigator.onLine;
  
  log.nav(`Intercepting van-gogh navigation for: ${url.pathname} (${isOffline ? 'offline' : 'online'})`);
  
  // Handle specific redirect cases
  if (url.pathname === '/van-gogh') {
    log.nav(`Redirecting /van-gogh to /van-gogh/en-GB/room-1`);
    return Response.redirect('/van-gogh/en-GB/room-1', 302);
  }
  
  if (url.pathname === '/van-gogh/en-GB/' || url.pathname === '/van-gogh/en-GB') {
    log.nav(`Redirecting /van-gogh/en-GB to /van-gogh/en-GB/room-1`);
    return Response.redirect('/van-gogh/en-GB/room-1', 302);
  }
  
  if (url.pathname === '/van-gogh/zh-TW') {
    log.nav(`Redirecting /van-gogh/zh-TW to /van-gogh/zh-TW/room-1`);
    return Response.redirect('/van-gogh/zh-TW/room-1', 302);
  }
  
  // Extract locale and position from URL path
  const pathParts = url.pathname.split('/');
  let newLocale = currentLocale;
  let newPosition = currentPosition;
  let isLocaleChange = false;
  
  if (pathParts.length >= 3) {
    newLocale = pathParts[2];
    
    // Detect position changes from URL patterns
    if (pathParts.length >= 4) {
      const roomMatch = pathParts[3].match(/room-(\d+)/);
      if (roomMatch) {
        const roomId = pathParts[3];
        let paintingId = null;
        
        // Check if there's a painting in the URL
        if (pathParts.length >= 5) {
          const paintingMatch = pathParts[4].match(/painting-(\d+)-(\d+)/);
          if (paintingMatch) {
            paintingId = pathParts[4];
          }
        }
        
        newPosition = { roomId, paintingId };
      }
    } else if (pathParts.length === 3) {
      // Just locale change, no specific room
      newPosition = null;
    }
  }
  
  // Check for locale changes
  if (SUPPORTED_LOCALES.includes(newLocale) && newLocale !== currentLocale) {
    log.nav(`Locale change detected: ${currentLocale} → ${newLocale}`);
    log.nav(`URL path: ${url.pathname}, isOffline: ${isOffline}`);
    currentLocale = newLocale;
    isLocaleChange = true;
    
    // Trigger caching for the new locale - only if room data is initialized
    if (!isOffline && roomDataInitialized) {
      log.nav(`Triggering asset caching for new locale: ${newLocale}`);
      cacheAssets(newLocale).catch(error => {
        log.warn('Locale caching failed for new locale:', error);
      });
    } else {
      log.nav(`Skipping asset caching for locale ${newLocale} - offline: ${isOffline}, roomDataInitialized: ${roomDataInitialized}`);
    }
  }
  
  // Check for position changes
  if (newPosition && (!currentPosition || 
      newPosition.roomId !== currentPosition.roomId || 
      newPosition.paintingId !== currentPosition.paintingId)) {
    log.nav(`Position change detected:`, currentPosition, '→', newPosition);
    currentPosition = newPosition;
    
    // Always trigger caching for current locale on navigation - only if room data is initialized
    if (!isOffline && roomDataInitialized) {
      if (!fullyCachedLocales.has(currentLocale)) {
        log.init(`Current locale ${currentLocale} not fully cached, triggering aggressive caching`);
        cacheAssets(currentLocale).catch(error => {
          log.warn('Asset caching failed for current locale:', error);
        });
      } else {
        log.data(`Current locale ${currentLocale} already fully cached`);
      }
    }
  }
  
  const cache = await caches.open(CACHE_NAME);
  
  // SPECIAL HANDLING FOR LOCALE CHANGES: Network-first when online
  if (isLocaleChange && !isOffline) {
    log.nav(`Locale change detected - using network-first strategy for: ${url.pathname}`);
    try {
      log.nav(`Fetching new locale from network: ${url.pathname}`);
      
      // Add a small timeout to ensure network request completes
      const networkResponse = await Promise.race([
        fetch(request),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 5000)
        )
      ]);
      
      if (networkResponse.ok) {
        log.nav(`Serving fresh locale page from network: ${url.pathname}`);
        return networkResponse;
      } else {
        log.warn(`Network response not ok for locale change ${url.pathname}: ${networkResponse.status}`);
      }
    } catch (error) {
      log.warn(`Network fetch failed for locale change ${url.pathname}:`, error);
    }
    
    // If network fails for locale change, fall through to cache/fallback logic
    log.nav(`Network failed for locale change, trying cache/fallback for: ${url.pathname}`);
  }
  
  // For non-locale changes or offline: Cache-first strategy
  let cachedResponse = await cache.match(request);
  if (cachedResponse) {
    log.nav(`Serving cached page: ${url.pathname}`);
    return cachedResponse;
  }
  
  // Debug: List all cached pages to see what's actually in the cache
  log.nav(`Cache miss for ${url.pathname}, checking what's in cache...`);
  const allCachedRequests = await cache.keys();
  const cachedPages = allCachedRequests.filter(req => req.url.includes('/van-gogh/'));
  log.nav(`Cached pages:`, cachedPages.map(req => req.url.split('/').slice(-2).join('/')));
  
  // If online and not a locale change, fetch from network
  if (!isOffline && !isLocaleChange) {
    try {
      log.nav(`Fetching from network: ${url.pathname}`);
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Return fresh page - React handles offline UI with cached data
        log.nav(`Serving fresh page from network: ${url.pathname}`);
        return networkResponse;
      } else {
        log.warn(`Network response not ok for ${url.pathname}: ${networkResponse.status}`);
      }
    } catch (error) {
      log.warn(`Network fetch failed for ${url.pathname}:`, error);
    }
  }
  
  // Only use fallbacks when offline or network fails
  log.nav(`Network unavailable, trying fallbacks for: ${url.pathname}`);
  
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
      const fallbackRequest = new Request(fallbackUrl);
      cachedResponse = await cache.match(fallbackRequest);
      if (cachedResponse) {
        log.nav(`Serving offline fallback: ${fallbackUrl} for ${url.pathname}`);
        return cachedResponse;
      }
    }
  }
  
  // Try to get a cached version of the default locale as last resort
  const defaultRequest = new Request('/van-gogh/en-GB');
  cachedResponse = await cache.match(defaultRequest);
  if (cachedResponse) {
    log.nav(`Serving default locale offline fallback for ${url.pathname}`);
    return cachedResponse;
  }
  
  // Offline fallback or network error
  log.nav(`Serving offline page for: ${url.pathname}`);
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
          <a href="/van-gogh/en-GB/room-1" style="color: #007AFF; text-decoration: none;">← Return to Van Gogh Guide</a>
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

// Handle Next.js image optimization requests - serve raw assets when offline
async function handleNextImageRequest(request) {
  const url = new URL(request.url);
  const isOffline = !navigator.onLine;
  
  log.nav(`🖼️ Next.js image request intercepted: ${request.url} (${isOffline ? 'OFFLINE' : 'online'})`);
  
  // Extract the original image URL from the Next.js image optimization URL
  const imageUrl = url.searchParams.get('url');
  if (!imageUrl) {
    log.warn('🖼️ No image URL found in Next.js image request:', request.url);
    return new Response('No image URL provided', { status: 400 });
  }
  
  // Decode URL in case it's encoded
  const decodedImageUrl = decodeURIComponent(imageUrl);
  log.nav(`🖼️ Extracted image URL: ${decodedImageUrl} (${isOffline ? 'OFFLINE' : 'online'})`);
  
  // Always serve from cache first when it's a van-gogh asset, regardless of online status
  if (decodedImageUrl.startsWith('/van-gogh-assets/')) {
    const assetsCache = await caches.open(ASSETS_CACHE);
    const staticCache = await caches.open(STATIC_CACHE);
    
    log.nav(`🖼️ Trying to serve van-gogh asset from cache: ${decodedImageUrl}`);
    
    // Try assets cache first
    let cachedAsset = await assetsCache.match(decodedImageUrl);
    if (!cachedAsset) {
      // Try static cache
      cachedAsset = await staticCache.match(decodedImageUrl);
      log.nav(`🖼️ Tried static cache for: ${decodedImageUrl}, found: ${!!cachedAsset}`);
    }
    
    if (cachedAsset) {
      log.nav(`🖼️ Serving cached raw asset for Next.js image: ${decodedImageUrl}`);
      
      // Clone the response and set proper headers
      const responseBody = await cachedAsset.arrayBuffer();
      const headers = new Headers();
      
      // Set proper content type based on file extension
      if (decodedImageUrl.endsWith('.png')) {
        headers.set('Content-Type', 'image/png');
      } else if (decodedImageUrl.endsWith('.jpg') || decodedImageUrl.endsWith('.jpeg')) {
        headers.set('Content-Type', 'image/jpeg');
      } else if (decodedImageUrl.endsWith('.svg')) {
        headers.set('Content-Type', 'image/svg+xml');
      } else if (decodedImageUrl.endsWith('.webp')) {
        headers.set('Content-Type', 'image/webp');
      } else {
        // Default to the original content type if available
        const originalContentType = cachedAsset.headers.get('Content-Type');
        if (originalContentType) {
          headers.set('Content-Type', originalContentType);
        }
      }
      
      // Add cache headers
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
      
      return new Response(responseBody, {
        status: 200,
        headers: headers
      });
    }
    
    log.nav(`🖼️ Image not in cache: ${decodedImageUrl}`);
    
    // If not cached and online, try to fetch and cache the raw asset
    if (!isOffline) {
      try {
        log.nav(`🖼️ Fetching raw asset from network: ${decodedImageUrl}`);
        const rawAssetResponse = await fetch(decodedImageUrl);
        if (rawAssetResponse.ok) {
          // Cache the asset
          const responseClone = rawAssetResponse.clone();
          await assetsCache.put(decodedImageUrl, responseClone);
          log.nav(`🖼️ Fetched and cached raw asset for Next.js image: ${decodedImageUrl}`);
          
          // Return with proper headers
          const responseBody = await rawAssetResponse.arrayBuffer();
          const headers = new Headers();
          headers.set('Content-Type', rawAssetResponse.headers.get('Content-Type') || 'image/png');
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          
          return new Response(responseBody, { status: 200, headers });
        } else {
          log.warn(`🖼️ Raw asset fetch failed with status ${rawAssetResponse.status}: ${decodedImageUrl}`);
        }
      } catch (error) {
        log.warn(`🖼️ Failed to fetch raw asset ${decodedImageUrl}:`, error);
      }
    }
    
    // Fallback to a cached fallback image for van-gogh assets
    log.nav(`🖼️ Looking for fallback image for van-gogh asset: ${decodedImageUrl}`);
    const fallbackResponse = await assetsCache.match('/van-gogh-assets/fallback-image.jpg');
    if (fallbackResponse) {
      log.nav(`🖼️ Serving fallback image for van-gogh asset: ${decodedImageUrl}`);
      const responseBody = await fallbackResponse.arrayBuffer();
      const headers = new Headers();
      headers.set('Content-Type', 'image/jpeg');
      return new Response(responseBody, { status: 200, headers });
    }
    
    log.warn(`🖼️ No fallback image available for van-gogh asset: ${decodedImageUrl}`);
  }
  
  // For non-van-gogh assets, try the original optimized request when online
  if (!isOffline) {
    try {
      log.nav(`🖼️ Fetching optimized image from network: ${request.url}`);
      return await fetch(request);
    } catch (error) {
      log.warn(`🖼️ Failed to fetch optimized image ${request.url}:`, error);
    }
  }
  
  // Final fallback - return a placeholder or error
  log.error(`🖼️ Image request failed completely: ${request.url}`);
  return new Response('Image not available offline', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Handle Next.js static assets (CSS, JS, etc.) for offline support
async function handleStaticAssets(request) {
  const staticCache = await caches.open(STATIC_CACHE);
  const isOffline = !navigator.onLine;
  
  log.init(`Handling static asset: ${request.url} (${isOffline ? 'offline' : 'online'})`);
  
  // Always try cache first for static assets (they're immutable)
  const cachedResponse = await staticCache.match(request);
  if (cachedResponse) {
    log.nav(`Serving cached static asset: ${request.url}`);
    return cachedResponse;
  }
  
  // If online and not cached, fetch and cache
  if (!isOffline) {
    try {
      log.nav(`Fetching static asset from network: ${request.url}`);
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful responses (Next.js static assets are immutable)
        const responseClone = networkResponse.clone();
        staticCache.put(request, responseClone);
        log.nav(`Cached static asset: ${request.url}`);
        return networkResponse;
      }
    } catch (error) {
      log.warn(`Failed to fetch static asset ${request.url}:`, error);
    }
  }
  
  // Offline fallback - return a basic response to prevent errors
  log.nav(`Static asset not available offline: ${request.url}`);
  
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
  
  // For font files, return empty response to prevent font loading errors
  if (request.url.match(/\.(woff2?|ttf|eot)$/)) {
    return new Response('', {
      status: 200,
      headers: { 'Content-Type': 'font/woff2' }
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
  const isOffline = !navigator.onLine;
  
  log.nav(`🎯 Asset request: ${request.url} (${isOffline ? 'OFFLINE' : 'online'})`);
  
  // For audio files, handle range requests specially
  if (request.url.includes('.aac') || request.url.includes('.mp3')) {
    log.nav(`🎵 Handling audio request: ${request.url}`);
    return handleAudioRequest(request, assetsCache);
  }
  
  // Try cache first for other assets
  const cachedResponse = await assetsCache.match(request);
  if (cachedResponse) {
    log.nav(`📦 Serving cached asset: ${request.url}`);
    return cachedResponse;
  }

  // Try data cache for JSON files
  const dataResponse = await dataCache.match(request);
  if (dataResponse) {
    log.nav(`📋 Serving cached data: ${request.url}`);
    return dataResponse;
  }

  log.nav(`❌ Asset not in cache: ${request.url}`);

  // If not in cache, try network and cache the response (only if online)
  if (!isOffline) {
    try {
      log.nav(`🌐 Fetching from network: ${request.url}`);
      const networkResponse = await fetch(request);
      
      // Handle partial responses properly - don't cache them but return them
      if (networkResponse.status === 206) {
        log.warn(`Received partial response (206) for ${request.url} - returning without caching`);
        return networkResponse;
      }
      
      // Cache successful, complete responses
      if (networkResponse.ok) {
        // Cache in appropriate cache based on content type
        if (request.url.includes('.json')) {
          dataCache.put(request, networkResponse.clone());
          log.nav(`💾 Cached JSON data: ${request.url}`);
        } else {
          assetsCache.put(request, networkResponse.clone());
          log.nav(`💾 Cached asset: ${request.url}`);
        }
      }
      return networkResponse;
    } catch (error) {
      log.warn('Asset request failed:', request.url, error);
    }
  }
  
  log.warn(`🔍 Looking for fallback for: ${request.url}`);
  
  // Return fallback for images
  if (request.url.includes('.png') || request.url.includes('.jpg')) {
    const fallbackResponse = await assetsCache.match('/van-gogh-assets/fallback-image.jpg');
    if (fallbackResponse) {
      log.nav(`🖼️ Serving image fallback for: ${request.url}`);
      return fallbackResponse;
    }
  }
  
  // Return fallback for audio (prefer AAC, fallback to MP3)
  if (request.url.includes('.mp3') || request.url.includes('.aac')) {
    // Try AAC fallback first (preferred format)
    const aacFallbackResponse = await assetsCache.match('/van-gogh-assets/silence.aac');
    if (aacFallbackResponse) {
      log.nav(`🎵 Serving AAC audio fallback for: ${request.url}`);
      return aacFallbackResponse;
    }
    // Try MP3 fallback if AAC not available
    const mp3FallbackResponse = await assetsCache.match('/van-gogh-assets/mp3/silence.mp3');
    if (mp3FallbackResponse) {
      log.nav(`🎵 Serving MP3 audio fallback for: ${request.url}`);
      return mp3FallbackResponse;
    }
  }
  
  // If no fallback available, throw error
  log.error(`💥 No fallback available for: ${request.url}`);
  throw new Error(`Asset not found and no fallback available: ${request.url}`);
}

// Enhanced audio request handler that supports range requests
async function handleAudioRequest(request, assetsCache) {
  const url = new URL(request.url);
  const isOffline = !navigator.onLine;
  const rangeHeader = request.headers.get('range');
  
  log.nav(`🎵 Audio request: ${request.url} (${isOffline ? 'OFFLINE' : 'online'}) ${rangeHeader ? `[Range: ${rangeHeader}]` : '[Full]'}`);
  
  // Try to get the complete audio file from cache first
  const cachedResponse = await assetsCache.match(request.url);
  if (cachedResponse) {
    log.nav(`🎵 Found cached audio: ${request.url}`);
    
    // Handle range requests from cached complete audio file
    if (rangeHeader) {
      log.nav(`🎵 Serving range request from cache: ${request.url}`);
      return handleRangeRequest(cachedResponse, rangeHeader);
    }
    return cachedResponse;
  }
  
  log.nav(`🎵 Audio not in cache: ${request.url}`);
  
  // If online, try to fetch and cache the complete audio file
  if (!isOffline) {
    try {
      log.nav(`🎵 Fetching audio from network: ${request.url}`);
      
      // Fetch the complete audio file (without range header to get full file)
      const fullRequest = new Request(request.url, {
        method: 'GET',
        headers: new Headers(request.headers)
      });
      
      // Remove range header to get complete file
      fullRequest.headers.delete('range');
      
      const networkResponse = await fetch(fullRequest);
      
      if (networkResponse.ok && networkResponse.status === 200) {
        // Cache the complete audio file
        const responseClone = networkResponse.clone();
        await assetsCache.put(request.url, responseClone);
        log.nav(`🎵 Cached complete audio file: ${request.url}`);
        
        // Handle range request from the complete file
        if (rangeHeader) {
          log.nav(`🎵 Serving range request from fresh download: ${request.url}`);
          return handleRangeRequest(networkResponse, rangeHeader);
        }
        return networkResponse;
      } else {
        log.warn(`🎵 Audio fetch failed with status ${networkResponse.status}: ${request.url}`);
      }
    } catch (error) {
      log.warn(`🎵 Failed to fetch audio file ${request.url}:`, error);
    }
  }
  
  // Fallback to silence audio files
  log.warn(`🎵 Audio file not available: ${request.url}, serving silence fallback`);
  const aacFallbackResponse = await assetsCache.match('/van-gogh-assets/silence.aac');
  if (aacFallbackResponse) {
    log.nav(`🎵 Serving silence fallback for: ${request.url}`);
    if (rangeHeader) {
      return handleRangeRequest(aacFallbackResponse, rangeHeader);
    }
    return aacFallbackResponse;
  }
  
  // Final fallback
  log.error(`🎵 No audio fallback available for: ${request.url}`);
  throw new Error(`Audio file not found and no fallback available: ${request.url}`);
}

// Handle HTTP range requests for audio files
async function handleRangeRequest(response, rangeHeader) {
  const arrayBuffer = await response.arrayBuffer();
  const totalLength = arrayBuffer.byteLength;
  
  // Parse range header (e.g., "bytes=0-1023")
  const rangeMatch = rangeHeader.match(/bytes=(\d*)-(\d*)/);
  if (!rangeMatch) {
    return new Response(arrayBuffer, {
      status: 200,
      headers: response.headers
    });
  }
  
  const start = parseInt(rangeMatch[1], 10) || 0;
  const end = parseInt(rangeMatch[2], 10) || totalLength - 1;
  
  if (start >= totalLength || end >= totalLength || start > end) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${totalLength}`
      }
    });
  }
  
  const chunkSize = end - start + 1;
  const chunk = arrayBuffer.slice(start, end + 1);
  
  return new Response(chunk, {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${totalLength}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': response.headers.get('Content-Type') || 'audio/aac'
    }
  });
}

// Debug function to log cache contents
async function logCacheContents() {
  try {
    const assetsCache = await caches.open(ASSETS_CACHE);
    const keys = await assetsCache.keys();
    log.data('Cached assets:', keys.map(req => req.url));
  } catch (error) {
    log.warn('Failed to log cache contents:', error);
  }
}

// Helper function to safely send message response
function sendMessageResponse(event, response) {
  log.data(`Sending message response:`, { 
    success: response.success, 
    hasPort: !!(event.ports && event.ports[0]),
    responseType: response.type || 'DATA_RESPONSE'
  });
  
  if (event.ports && event.ports[0]) {
    try {
      event.ports[0].postMessage(response);
      log.data(`Message sent successfully via MessageChannel`);
    } catch (error) {
      log.error(`Failed to send message via MessageChannel:`, error);
      // Fallback to client posting
      self.clients.matchAll().then(clients => {
        const targetClient = event.source || clients[0];
        if (targetClient) {
          targetClient.postMessage({
            type: 'SW_RESPONSE',
            originalType: response.type || 'DATA_RESPONSE',
            ...response
          });
        }
      });
    }
  } else {
    // Fallback: try to send to all clients
    log.warn(`No MessageChannel port available, using client postMessage fallback`);
    self.clients.matchAll().then(clients => {
      const targetClient = event.source || clients[0];
      if (targetClient) {
        targetClient.postMessage({
          type: 'SW_RESPONSE',
          originalType: response.type || 'DATA_RESPONSE',
          ...response
        });
        log.data(`Message sent to client via fallback method`);
      } else {
        log.error(`No clients available to send message to`);
      }
    });
  }
}

// Message handler for cache management
self.addEventListener('message', async (event) => {
  const { data } = event;
  
  log.data(`Received message from client: ${data.type}`);
  
  try {
    switch (data.type) {
      case 'INIT_ROOM_DATA':
        // Legacy message handler - room data is now fetched directly by service worker
        // This case is kept for backward compatibility but is no longer needed
        log.data('Received legacy INIT_ROOM_DATA message - room data is now fetched directly by service worker');
        
        // If room data is not initialized, try to fetch it now
        if (!roomDataInitialized) {
          log.init('Room data not initialized, attempting to fetch directly...');
          try {
            const { roomData, assetData: fetchedAssetData } = await fetchAllRoomData();
            
            // Store room data and asset URLs
            Object.entries(roomData).forEach(([locale, rooms]) => {
              cachedData.set(locale, { rooms });
              log.data(`Stored room data for ${locale}: ${rooms.length} rooms`);
            });
            
            Object.entries(fetchedAssetData).forEach(([locale, assets]) => {
              assetData.set(locale, assets);
              log.data(`Stored asset URLs for ${locale}: ${assets.audio.length} audio, ${assets.images.length} images`);
            });
            
            roomDataInitialized = true;
            
            // Cache room data JSON files for offline access
            const dataCache = await caches.open(DATA_CACHE);
            for (const [locale, rooms] of Object.entries(roomData)) {
              const response = new Response(JSON.stringify({ rooms }), {
                headers: { 'Content-Type': 'application/json' }
              });
              await dataCache.put(`/van-gogh-assets/${locale}_rooms.json`, response);
              log.data(`Cached room data JSON for ${locale}`);
            }
            
            // Trigger initial asset caching
            const defaultLocale = 'en-GB';
            log.init(`Triggering initial asset caching for ${defaultLocale} after delayed initialization`);
            cacheAssets(defaultLocale).catch(error => {
              log.warn('Initial asset caching failed after delayed initialization:', error);
            });
            
            sendMessageResponse(event, {
              success: true,
              message: `Room data fetched and initialized for ${Object.keys(roomData).length} locales`
            });
            
          } catch (error) {
            log.error('Failed to fetch room data:', error);
            sendMessageResponse(event, {
              success: false,
              message: `Failed to fetch room data: ${error.message}`
            });
          }
        } else {
          sendMessageResponse(event, {
            success: true,
            message: 'Room data already initialized'
          });
        }
        break;

      case 'UPDATE_POSITION':
        // Update current position and trigger asset caching
        currentPosition = data.position;
        const previousLocale = currentLocale;
        currentLocale = data.locale || currentLocale;
        
        const isLocaleChange = data.isLocaleChange || (previousLocale !== currentLocale);
        
        if (isLocaleChange) {
          log.nav(`Locale change via message: ${previousLocale} → ${currentLocale}`);
          log.nav('Position updated:', currentPosition, 'Locale:', currentLocale);
          
          // Trigger asset caching for new locale immediately
          if (roomDataInitialized) {
            log.init(`Triggering immediate asset caching for new locale: ${currentLocale}`);
            cacheAssets(currentLocale).catch(error => {
              log.warn('Asset caching failed for new locale:', error);
            });
          }
        } else {
          log.nav('Position updated:', currentPosition, 'Locale:', currentLocale);
          
          // Trigger asset caching for current locale
          await cacheAssets(currentLocale);
        }
        
        sendMessageResponse(event, {
          success: true,
          message: `Asset caching triggered for ${currentLocale}${isLocaleChange ? ' (locale change)' : ''}`
        });
        break;

      case 'CACHE_LOCALE':
        // Trigger asset caching for a specific locale
        if (data.locale && SUPPORTED_LOCALES.includes(data.locale)) {
          log.init(`Manual asset caching requested for ${data.locale}`);
          await cacheAssets(data.locale);
          
          sendMessageResponse(event, {
            success: true,
            message: `Asset caching triggered for ${data.locale}`
          });
        } else {
          throw new Error('Invalid locale provided for asset caching');
        }
        break;

      case 'GET_CACHED_DATA':
        // Return cached room data for client-side rendering
        log.data(`GET_CACHED_DATA request for locale: ${data.locale}`);
        
        if (data.locale && SUPPORTED_LOCALES.includes(data.locale)) {
          // Prefer initialized data from server
          let roomData = cachedData.get(data.locale);
          log.data(`Cached data from memory for ${data.locale}:`, roomData ? 'found' : 'not found');
          
          if (!roomData) {
            // Fallback to cached JSON if not initialized from server
            log.data(`Trying to get room data from cache for ${data.locale}`);
            const dataCache = await caches.open(DATA_CACHE);
            const roomDataResponse = await dataCache.match(`/van-gogh-assets/${data.locale}_rooms.json`);
            
            if (roomDataResponse) {
              roomData = await roomDataResponse.json();
              log.data(`Found room data in cache for ${data.locale}: ${roomData.rooms?.length || 0} rooms`);
            } else {
              log.error(`No room data found for ${data.locale} - neither in memory nor in cache`);
              throw new Error('Room data not available');
            }
          }
          
          // Ensure we return the rooms array, not the wrapper object
          const rooms = roomData.rooms || roomData;
          log.data(`Returning room data for ${data.locale}: ${rooms.length} rooms`);
          
          sendMessageResponse(event, {
            success: true,
            roomData: { rooms }
          });
        } else {
          log.error(`Invalid locale provided: ${data.locale}`);
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
    log.error('Message handler error:', error);
    sendMessageResponse(event, {
      success: false,
      message: error.message
    });
  }
});

log.init('AGGRESSIVE asset-only Van Gogh service worker loaded - supports React offline navigation with cached data and assets');