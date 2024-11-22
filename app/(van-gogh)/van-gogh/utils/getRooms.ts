import { promises as fs } from 'fs'
import { Painting, Room } from '../types'
import { Locale, DEFAULT_LOCALE } from '@/lib/localization'

export async function getRooms(locale: Locale = DEFAULT_LOCALE): Promise<Room[]> {
  const fileName = `${locale.slice(0,2).toLowerCase()}-${locale.slice(3).toUpperCase()}_rooms.json`
  const filePath = `${process.cwd()}/public/van-gogh/${fileName}`

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