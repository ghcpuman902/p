import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { defaultCache } from "@serwist/next/worker";
import { 
  Serwist, 
  CacheFirst, 
  NetworkFirst, 
  ExpirationPlugin, 
  CacheOnly 
} from 'serwist';
import { type Room, type Painting } from './(van-gogh)/van-gogh/libs/types';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Add message handler for cache management
addEventListener('message', async (event) => {
  console.log('🔄 SW: Received message:', event.data);
  
  if (event.data.type === 'PURGE_CACHE') {
    console.log('🗑️ SW: Starting cache purge...');
    try {
      // Delete all caches
      const cacheNames = await caches.keys();
      console.log('📋 SW: Found caches to purge:', cacheNames);
      
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ SW: Successfully purged all caches');
      
      event.ports[0].postMessage({ success: true, message: 'All caches purged successfully' });
    } catch (error) {
      console.error('❌ SW: Failed to purge caches:', error);
      event.ports[0].postMessage({ 
        success: false, 
        message: 'Failed to purge caches',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  if (event.data.type === 'CACHE_ASSETS' && event.data.locale) {
    const locale = event.data.locale;
    console.log(`🚀 SW: Starting asset caching for locale: ${locale}`);
    
    try {
      const assets = [];
      
      // Cache images (locale-independent)
      console.log('🖼️ SW: Adding image files to cache list...');
      const imageFiles = ['p21.png', 'p27.png', 'p33.png', 'p44.png', 'p8.png', 'r3.png', 'r6.png'];
      assets.push(
        ...imageFiles.map(img => `/van-gogh-assets/${img}`),
        '/van-gogh-assets/fallback-image.jpg'
      );
      console.log('📋 SW: Image files to cache:', assets);

      let roomsData;
      // Cache audio files for the specified locale
      try {
        console.log(`📂 SW: Fetching room data for locale ${locale}...`);
        // Fetch room data to get audio file paths
        const roomsResponse = await fetch(`/van-gogh-assets/${locale}_rooms.json`);
        if (!roomsResponse.ok) {
          throw new Error(`HTTP error! status: ${roomsResponse.status}`);
        }
        roomsData = await roomsResponse.json();
        console.log(`✅ SW: Successfully loaded room data for ${locale}`);
        
        // Add room audio files
        console.log('🎵 SW: Adding audio files to cache list...');
        roomsData.rooms.forEach((room: Room, index: number) => {
          const roomNumber = index + 1;
          const roomAudioPath = `/van-gogh-assets/${locale}.room-${roomNumber}.aac`;
          assets.push(roomAudioPath);
          console.log(`📌 SW: Added room audio: ${roomAudioPath}`);
          
          // Add painting audio files
          room.paintings.forEach((painting: Painting) => {
            const paintingAudioPath = `/van-gogh-assets/${locale}.painting-${roomNumber}-${painting.paintingNumber}.aac`;
            assets.push(paintingAudioPath);
            console.log(`📌 SW: Added painting audio: ${paintingAudioPath}`);
          });
        });
      } catch (error) {
        console.error('❌ SW: Error processing room data:', 
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw new Error('Failed to process room data');
      }

      // Cache HTML pages for the specified locale
      if (roomsData) {
        console.log('🌐 SW: Adding HTML pages to cache list...');
        assets.push(
          ...roomsData.rooms.map((room: Room) => `/van-gogh/${locale}/${room.id}`)
        );
      }

      // Send progress updates
      event.ports[0].postMessage({ 
        type: 'progress', 
        message: 'Loading room data...' 
      });

      // After room data is loaded
      event.ports[0].postMessage({ 
        type: 'progress', 
        message: `Caching ${assets.length} files...` 
      });

      // Cache all assets
      const cache = await caches.open('van-gogh-assets');
      let completed = 0;
      
      const results = await Promise.allSettled(
        assets.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            await cache.put(url, response);
            completed++;
            if (completed % 5 === 0) { // Send update every 5 files
              event.ports[0].postMessage({ 
                type: 'progress', 
                message: `Cached ${completed}/${assets.length} files` 
              });
            }
            return { url, status: 'cached' };
          } catch (error) {
            return { 
              url, 
              status: 'failed', 
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );

      // Prepare detailed response
      const summary = {
        total: results.length,
        succeeded: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        details: results.map(r => {
          if (r.status === 'fulfilled') {
            return {
              url: r.value.url,
              status: 'cached'
            };
          } else {
            return {
              url: 'unknown', // or some default value
              status: 'failed',
              error: r.reason instanceof Error ? r.reason.message : 'Unknown error'
            };
          }
        })
      };

      event.ports[0].postMessage({ 
        success: true, 
        message: `Cached ${summary.succeeded} of ${summary.total} assets for locale ${locale}`,
        summary 
      });
    } catch (error) {
      event.ports[0].postMessage({ 
        success: false, 
        message: `Failed to cache assets for locale ${locale}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    ...defaultCache,
    // Cache van-gogh assets with CacheOnly, falling back to CacheFirst
    {
      matcher: /\/van-gogh-assets\/.*\.(png|jpg|jpeg|webp|gif|svg|mp3|aac|wav)$/i,
      handler: async (options) => {
        try {
          // First try CacheOnly
          const cacheOnly = new CacheOnly({
            cacheName: 'van-gogh-assets',
            plugins: [
              new ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              }),
            ],
          });
          
          const response = await cacheOnly.handle(options);
          return response;
        } catch {
          // If not in cache, fall back to CacheFirst
          const cacheFirst = new CacheFirst({
            cacheName: 'van-gogh-assets',
            plugins: [
              new ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              }),
            ],
          });
          return cacheFirst.handle(options);
        }
      },
    },
    // Cache page HTML with NetworkFirst, falling back to CacheOnly
    {
      matcher: /\/van-gogh\/.*/,
      handler: async (options) => {
        try {
          // First try NetworkFirst
          const networkFirst = new NetworkFirst({
            cacheName: 'van-gogh-pages',
            plugins: [
              new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
              }),
            ],
            networkTimeoutSeconds: 3,
            matchOptions: {
              ignoreSearch: true,
            },
          });
          
          const response = await networkFirst.handle(options);
          return response;
        } catch {
          // If network fails, fall back to CacheOnly
          const cacheOnly = new CacheOnly({
            cacheName: 'van-gogh-pages',
            plugins: [
              new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
              }),
            ],
          });
          return cacheOnly.handle(options);
        }
      },
    },
  ],
  fallbacks: {
    entries: [
      {
        url: "/van-gogh/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

// Register event listeners
serwist.addEventListeners();
