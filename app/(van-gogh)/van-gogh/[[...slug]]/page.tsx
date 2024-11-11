import { notFound, redirect } from 'next/navigation'
import { type Room, type Painting } from '../types'
import { getRooms } from '../utils/getRooms'
import PaintingDetails from '../components/PaintingDetails'

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const languages = ['en-GB', 'zh-TW']
  const allParams = []

  for (const lang of languages) {
    const rooms = await getRooms(lang)
    
    // Generate params for room-painting combinations
    const roomPaintingParams = rooms.flatMap((room: Room) =>
      room.paintings.map((painting: Painting) => ({
        slug: [lang, room.id, painting.id]
      }))
    )

    // Generate params for room IDs
    const roomParams = rooms.map((room: Room) => ({
      slug: [lang, room.id]
    }))

    // Generate params for painting numbers
    const paintingParams = rooms.flatMap((room: Room) => 
      room.paintings.map((painting: Painting) => ({
        slug: [lang, `painting-${painting.paintingNumber}`]
      }))
    )

    allParams.push(...roomPaintingParams, ...roomParams, ...paintingParams)
  }

  // Add default language routes
  const defaultRooms = await getRooms('en-GB')
  const defaultParams = [
    ...defaultRooms.flatMap((room: Room) =>
      room.paintings.map((painting: Painting) => ({
        slug: [room.id, painting.id]
      }))
    ),
    ...defaultRooms.map((room: Room) => ({
      slug: [room.id]
    })),
    ...defaultRooms.flatMap((room: Room) => 
      room.paintings.map((painting: Painting) => ({
        slug: [`painting-${painting.paintingNumber}`]
      }))
    )
  ]

  return [...allParams, ...defaultParams]
}

export default async function Page({ 
  params 
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  let lang = 'en-GB'
  let roomId: string
  let paintingId: string | undefined

  if (slug.length === 1) {
    [roomId] = slug
  } else if (slug.length === 2) {
    if (slug[0] === 'en-GB' || slug[0] === 'zh-TW') {
      [lang, roomId] = slug
    } else {
      [roomId, paintingId] = slug
    }
  } else if (slug.length === 3) {
    [lang, roomId, paintingId] = slug
  } else {
    notFound()
  }

  const rooms = await getRooms(lang)

  // First try to find room directly
  const currentRoom = rooms.find((room: Room) => room.id === roomId)
  let currentPainting: Painting | null = null
  
  // If room not found, check if it's a painting number
  if (!currentRoom && roomId.startsWith('painting-')) {
    const paintingNumber = roomId.split('-')[1]
    // Find painting across all rooms
    for (const room of rooms) {
      const painting = room.paintings.find(
        (p: Painting) => p.paintingNumber === paintingNumber
      )
      if (painting) {
        // Redirect to the canonical URL format, preserving language
        const langPath = lang !== 'en-GB' ? `/${lang}` : ''
        redirect(`/van-gogh${langPath}/room-${painting.roomNumber}/${painting.id}`)
      }
    }
    // If we get here, painting number was invalid
    notFound()
  }

  // Handle invalid room ID format or non-existent room
  if (!currentRoom) {
    notFound()
  }

  // Handle painting ID if provided
  if (paintingId) {
    if (paintingId.match(/^\d+$/)) {
      currentPainting = currentRoom.paintings.find(
        (p: Painting) => p.paintingNumber === paintingId
      ) || null
    } else {
      currentPainting = currentRoom.paintings.find(
        (painting: Painting) => painting.id === paintingId
      ) || null
    }

    if (currentPainting) {
      // Redirect to canonical URL format if necessary
      if (paintingId !== currentPainting.id) {
        const langPath = lang !== 'en-GB' ? `/${lang}` : ''
        redirect(`/van-gogh${langPath}/${currentRoom.id}/${currentPainting.id}`)
      }
    } else {
      // If painting doesn't exist in this room, redirect to room view
      const langPath = lang !== 'en-GB' ? `/${lang}` : ''
      redirect(`/van-gogh${langPath}/${roomId}`)
    }
  }

  return (
    <PaintingDetails
      currentRoom={currentRoom}
      currentPainting={currentPainting}
    />
  )
}