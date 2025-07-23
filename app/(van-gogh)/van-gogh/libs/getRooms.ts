import { promises as fs } from 'fs'
import { Painting, Room } from './types'
import { Locale, DEFAULT_LOCALE } from './localization'

export async function getRooms(locale: Locale = DEFAULT_LOCALE): Promise<Room[]> {
  const fileName = `${locale.slice(0,2).toLowerCase()}-${locale.slice(3).toUpperCase()}_rooms.json`
  const filePath = `${process.cwd()}/public/van-gogh-assets/${fileName}`

  try {
    const roomsJson = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(roomsJson)

    return data.rooms.map((room: Room, index: number) => {
      const roomNumber = index + 1
      return {
        ...room,
        id: `room-${roomNumber}`,
        roomNumber: roomNumber,
        paintings: room.paintings.map((painting: Painting) => ({
          ...painting,
          type: 'painting' as const,
          id: `painting-${roomNumber}-${painting.paintingNumber}`,
          roomNumber: roomNumber,
        }))
      }
    })
  } catch (error) {
    console.error(`Error reading file for locale ${locale}:`, error)
    if (locale.toLowerCase() !== DEFAULT_LOCALE.toLowerCase()) {
      console.log('Falling back to default locale')
      return getRooms(DEFAULT_LOCALE)
    }
    throw error
  }
}

export interface LocaleAssets {
  locale: Locale;
  rooms: Room[];
  assets: {
    audio: string[];
    images: string[];
  };
}

export async function getLocaleAssets(locale: Locale = DEFAULT_LOCALE): Promise<LocaleAssets> {
  const rooms = await getRooms(locale);
  const assets = {
    audio: [] as string[],
    images: [] as string[]
  };

  // Generate all asset URLs
  rooms.forEach((room, roomIndex) => {
    const roomNumber = roomIndex + 1;
    const roomId = `room-${roomNumber}`;
    
    // Room audio
    assets.audio.push(`/van-gogh-assets/${locale}.${roomId}.aac`);
    
    // Room image
    if (room.roomImage) {
      assets.images.push(`/van-gogh-assets/${room.roomImage.url}`);
    }
    
    // Paintings
    room.paintings.forEach((painting) => {
      const paintingId = `painting-${roomNumber}-${painting.paintingNumber}`;
      
      // Painting audio
      assets.audio.push(`/van-gogh-assets/${locale}.${paintingId}.aac`);
      
      // Painting image
      if (painting.image) {
        assets.images.push(`/van-gogh-assets/${painting.image.url}`);
      }
    });
  });

  return {
    locale,
    rooms,
    assets
  };
}