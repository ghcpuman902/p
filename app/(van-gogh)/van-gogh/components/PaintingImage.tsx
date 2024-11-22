'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
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
  const [isCached, setIsCached] = useState<boolean>(false);
  const imageSrc = `/van-gogh-assets/${imageUrl}`;

  useEffect(() => {
    setIsOffline(!window.navigator.onLine);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Check if image is cached
    const checkCache = async () => {
      try {
        const cache = await caches.open('van-gogh-assets');
        const cachedResponse = await cache.match(imageSrc);
        setIsCached(!!cachedResponse);
      } catch (e) {
        console.warn('Cache check failed:', e);
      }
    };

    checkCache();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [imageSrc]);

  return (
    <div className="flex flex-col items-center my-4">
      {isCached || !isOffline ? (
        <div className="relative w-full isolate">
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
            className="w-full h-auto"
            onError={() => {
              const errorMessage = isOffline 
                ? isCached 
                  ? getTranslation(locale, "offlineCachedImage")
                  : getTranslation(locale, "offlineUncachedImage")
                : getTranslation(locale, "imageLoadError");
              setImageLoadError(errorMessage);
            }}
          />
          {imageLoadError && (
            <p className="text-red-500 mt-2">{imageLoadError}</p>
          )}
        </div>
      ) : (
        <div className="w-full text-center p-4 bg-gray-200 rounded">
          <p className="text-gray-600">
            {getTranslation(locale, "offlineImageUnavailable")}
          </p>
        </div>
      )}
      <p className={cn(
        "mt-2",
        !isPainting ? "text-neutral-200" : "text-muted-foreground"
      )}>
        {description}
      </p>
    </div>
  );
} 