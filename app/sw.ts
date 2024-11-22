import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { defaultCache } from "@serwist/next/worker";
import { 
  Serwist, 
  CacheFirst, 
  NetworkFirst, 
  ExpirationPlugin, 
  CacheOnly 
} from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const PRECACHE_ASSETS = [
  '/offline',
  '/van-gogh-assets/fallback-image.jpg',
  '/van-gogh-assets/silence.aac'
];

const serwist = new Serwist({
  precacheEntries: [...(self.__SW_MANIFEST || []), ...PRECACHE_ASSETS],
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
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

// Register event listeners
serwist.addEventListeners();

// // Enhanced offline fallback handler
// self.addEventListener('fetch', event => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith(
//       (async () => {
//         try {
//           // Try navigation preload
//           const preloadResponse = await event.preloadResponse;
//           if (preloadResponse) return preloadResponse;

//           // Try network
//           try {
//             const networkResponse = await fetch(event.request);
//             if (networkResponse.ok) return networkResponse;
//             throw new Error('Network response was not ok');
//           } catch (error) {
//             console.warn('Network fetch error:', error);
//             // Network failed, try cache
//             const cache = await caches.open('van-gogh-pages');
//             const cachedResponse = await cache.match(event.request, {
//               ignoreSearch: true
//             });
//             if (cachedResponse) return cachedResponse;

//             // If cache fails, return offline page
//             const offlineResponse = await cache.match('/offline');
//             if (offlineResponse) return offlineResponse;

//             // If all fails, return a basic offline response
//             return new Response(
//               `<html><body><h1>Offline</h1><p>Please check your connection.</p><h2>Error:</h2><code><pre>${error?.toString?.() || JSON.stringify(error, null, 2)}</pre></code></body></html>`,
//               {
//                 headers: { 'Content-Type': 'text/html' },
//               }
//             );
//           }
//         } catch (error) {
//           console.error('Offline fallback error:', error);
//           // Final fallback
//           return new Response(
//             '<html><body><h1>Offline</h1><p>Please check your connection.</p></body></html>',
//             {
//               headers: { 'Content-Type': 'text/html' },
//             }
//           );
//         }
//       })()
//     );
//   }
// });