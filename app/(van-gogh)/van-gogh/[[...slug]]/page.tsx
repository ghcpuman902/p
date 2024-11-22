import { notFound, redirect } from 'next/navigation'
import { type Room, type Painting } from '../libs/types'
import { getRooms } from '../libs/getRooms'
import PaintingDetails from '../components/PaintingDetails'
import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/app/(van-gogh)/van-gogh/libs/localization'
// import { InstallPrompt } from '../components/InstallPrompt'


export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const allParams = []

  for (const locale of SUPPORTED_LOCALES) {
    const rooms = await getRooms(locale as Locale)
    const localeParams = [
      // Room-painting combinations
      ...rooms.flatMap((room: Room) =>
        room.paintings.map((painting: Painting) => ({
          slug: [locale, room.id, painting.id]
        }))
      ),
      // Room IDs
      ...rooms.map((room: Room) => ({
        slug: [locale, room.id]
      })),
      // Painting numbers
      ...rooms.flatMap((room: Room) => 
        room.paintings.map((painting: Painting) => ({
          slug: [locale, `painting-${painting.paintingNumber}`]
        }))
      )
    ]
    allParams.push(...localeParams)
  }

  // Add default language routes
  const defaultRooms = await getRooms(DEFAULT_LOCALE)
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
  const { slug = [] } = await params
  
  // Clean up the slug array by removing any extra locales
  const cleanSlug = (() => {
    const localeIndexes = slug
      .map((segment, index) => SUPPORTED_LOCALES.includes(segment as Locale) ? index : -1)
      .filter(index => index !== -1);
    
    if (localeIndexes.length > 1) {
      // Keep only the last locale and everything after it
      return slug.slice(localeIndexes[localeIndexes.length - 1]);
    }
    return slug;
  })();
  
  let locale: Locale = DEFAULT_LOCALE
  let roomId: string = ''
  let paintingId: string | undefined = undefined

  // Handle different URL patterns using cleanSlug instead of slug
  if (cleanSlug.length === 0) {
    // Root path: redirect to first room with default locale
    const rooms = await getRooms(DEFAULT_LOCALE)
    if (rooms.length > 0) {
      redirect(`/van-gogh/${rooms[0].id}`)
    }
    return notFound()
  } else if (cleanSlug.length === 1) {
    // Single segment: either locale or roomId
    if (SUPPORTED_LOCALES.includes(cleanSlug[0] as Locale)) {
      locale = cleanSlug[0] as Locale
      const rooms = await getRooms(locale)
      if (rooms.length > 0) {
        redirect(`/van-gogh/${locale}/${rooms[0].id}`)
      }
      return notFound()
    } else {
      roomId = cleanSlug[0]
    }
  } else if (cleanSlug.length === 2) {
    if (SUPPORTED_LOCALES.includes(cleanSlug[0] as Locale)) {
      locale = cleanSlug[0] as Locale
      roomId = cleanSlug[1]
    } else {
      roomId = cleanSlug[0]
      paintingId = cleanSlug[1]
    }
  } else if (cleanSlug.length === 3) {
    if (!SUPPORTED_LOCALES.includes(cleanSlug[0] as Locale)) {
      return notFound()
    }
    locale = cleanSlug[0] as Locale
    roomId = cleanSlug[1]
    paintingId = cleanSlug[2]
  } else {
    return notFound()
  }

  const rooms = await getRooms(locale)

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
        const localePath = locale !== DEFAULT_LOCALE ? `/${locale}` : ''
        redirect(`/van-gogh${localePath}/room-${painting.roomNumber}/${painting.id}`)
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
    // handle links from page that doesnt know the room number, like links in painting text
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
        const localePath = locale !== DEFAULT_LOCALE ? `/${locale}` : ''
        redirect(`/van-gogh${localePath}/${currentRoom.id}/${currentPainting.id}`)
      }
    } else {
      // If painting doesn't exist in this room, redirect to room view
      const localePath = locale !== DEFAULT_LOCALE ? `/${locale}` : ''
      redirect(`/van-gogh${localePath}/${roomId}`)
    }
  }

  return (
    <>
      <PaintingDetails
        currentRoom={currentRoom}
      currentPainting={currentPainting}
      locale={locale}
      />
    </>
  )
}