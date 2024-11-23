'use client'

import Image from 'next/image';
import { useState } from 'react';
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
  const imageSrc = `/van-gogh-assets/${imageUrl}`;

  return (
    <div className="flex flex-col items-center my-4 -z-10">
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-200 rounded">
          <p className="text-gray-600">
            {getTranslation(locale, "offlineImageUnavailable")}
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