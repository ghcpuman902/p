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


// Add message handler
addEventListener('message', (event) => {
  console.log('Received message:', event.data);
  if (event.data.type === 'GET_RANDOM_NUMBER') {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    event.ports[0].postMessage({ randomNumber });
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
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

// Register event listeners
serwist.addEventListeners();
