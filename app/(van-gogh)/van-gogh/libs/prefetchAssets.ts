import { type Room } from './types'
import { type Locale } from './localization'

export async function prefetchAssets(locale: Locale, rooms: Room[]) {
  // Create a cache instance
  const cache = await caches.open('van-gogh-assets')
  
  // Collect all URLs that need to be cached
  const urlsToCache: string[] = []

  // Add room audio and imagefiles (MP3 format)
  rooms.forEach(room => {
    urlsToCache.push(`/van-gogh-assets/mp3/${locale}.${room.id}.mp3`)
    if(room.roomImage) {
      urlsToCache.push(`/van-gogh-assets/${room.roomImage.url}`)
    }
    
    // Add painting audio and image files
    room.paintings.forEach(painting => {
      urlsToCache.push(`/van-gogh-assets/mp3/${locale}.${painting.id}.mp3`)
      if(painting.image) {
        urlsToCache.push(`/van-gogh-assets/${painting.image.url}`)
      }
    })
  })

  // Deduplicate URLs
  const uniqueUrls = [...new Set(urlsToCache)]

  // Prefetch and cache all assets
  const fetchPromises = uniqueUrls.map(async url => {
    try {
      // Check if already cached
      const cached = await cache.match(url)
      if (!cached) {
        const response = await fetch(url)
        if (response.ok) {
          await cache.put(url, response)
          return { url, status: 'cached' }
        }
        return { url, status: 'failed' }
      }
      return { url, status: 'already-cached' }
    } catch (error) {
      console.error(`Failed to cache ${url}:`, error)
      return { url, status: 'error' }
    }
  })

  return Promise.all(fetchPromises)
}

export function getCacheStatus(locale: Locale): Promise<{
  totalAssets: number
  cachedAssets: number
}> {
  return caches.open('van-gogh-assets').then(async cache => {
    const keys = await cache.keys()
    const localeAssets = keys.filter(key => 
      key.url.includes(`/${locale}.`) || 
      key.url.includes('/van-gogh-assets/')
    )
    return {
      cachedAssets: localeAssets.length,
      totalAssets: 0 // This will be set by the component
    }
  })
} 