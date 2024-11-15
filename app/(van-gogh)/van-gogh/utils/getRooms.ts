import { promises as fs } from 'fs'
import { Painting, Room } from '../types'

export async function getRooms(lang: string = 'en-GB'): Promise<Room[]> {
  const fileName = `${lang.slice(0,2).toLowerCase()}-${lang.slice(3).toUpperCase()}_rooms.json`
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
    console.error(`Error reading file for language ${lang}:`, error)
    if (lang.toLowerCase() !== 'en-gb') {
      console.log('Falling back to English')
      return getRooms('en-GB')
    }
    throw error
  }
}