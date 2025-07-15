'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getTranslation, Locale } from '@/app/(van-gogh)/van-gogh/libs/localization';
import { cn } from '@/lib/utils';

interface PaintingImageProps {
  imageUrl: string;
  description: string;
  locale: Locale;
  isPainting?: boolean;
}

export function PaintingImage({ imageUrl, description, locale, isPainting = true }: PaintingImageProps) {
  const [imageLoadError, setImageLoadError] = useState<string>('');
  const [isOffline, setIsOffline] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const imageSrc = `/van-gogh-assets/${imageUrl}`;

  // Check offline status and cache availability
  useEffect(() => {
    const checkOfflineStatus = async () => {
      // Check if we're offline
      const offline = !navigator.onLine;
      setIsOffline(offline);

      if (offline) {
        // Check if image is cached
        try {
          const cache = await caches.open('van-gogh-assets-v4');
          const cachedResponse = await cache.match(imageSrc);
          setIsCached(!!cachedResponse);
        } catch (error) {
          console.warn('Failed to check cache:', error);
          setIsCached(false);
        }
      } else {
        setIsCached(true); // Assume available when online
      }
    };

    checkOfflineStatus();

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [imageSrc]);

  // Show appropriate message based on offline status and cache availability
  const getFallbackMessage = () => {
    if (isOffline && !isCached) {
      return getTranslation(locale, "offlineUncachedImage");
    } else if (isOffline && isCached) {
      return getTranslation(locale, "offlineCachedImage");
    } else {
      return getTranslation(locale, "offlineImageUnavailable");
    }
  };

  return (
    <div className="flex flex-col items-center my-4 -z-10">
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-200 rounded">
          <p className="text-gray-600">
            {getFallbackMessage()}
          </p>
        </div>
        <Image
          src={imageSrc}
          alt={description}
          quality={100}
          width={1000}
          height={
            imageUrl === 'p21.png' ? 1242 :
            imageUrl === 'p27.png' ? 984 :
            imageUrl === 'p33.png' ? 668 :
            imageUrl === 'p44.png' ? 534 :
            imageUrl === 'p8.png' ? 711 :
            imageUrl === 'r3.png' ? 655 :
            imageUrl === 'r6.png' ? 747 : 1000
          }
          className="relative w-full h-auto"
          onError={() => {
            const errorMessage = getTranslation(locale, "imageLoadError");
            setImageLoadError(errorMessage);
          }}
        />
        {imageLoadError && (
          <p className="text-red-500 mt-2">{imageLoadError}</p>
        )}
      </div>
      <p className={cn(
        "mt-2",
        !isPainting ? "text-neutral-200" : "text-muted-foreground"
      )}>
        {description}
      </p>
    </div>
  );
} 