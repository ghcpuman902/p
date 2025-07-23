import { notFound, redirect } from 'next/navigation'
import { type Room, type Painting } from '../libs/types'
import { getRooms } from '../libs/getRooms'
import PaintingDetails from '../components/PaintingDetails'
import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/app/(van-gogh)/van-gogh/libs/localization'
import OfflinePage from './Offline'
// import { InstallPrompt } from '../components/InstallPrompt'

const paintingIdNeeded = [13, 18, 19, 35, 3, 43, 48, 47, 58, 59, 23, 53].sort((a, b) => a - b).map(num => `painting-${num}`)

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const allParams = []

  // Add offline route
  allParams.push({ slug: ['offline'] })

  // DO NOT add root path (empty slug) - let service worker handle redirect
  // DO NOT add locale-only paths - let service worker handle redirect

  for (const locale of SUPPORTED_LOCALES) {
    const rooms = await getRooms(locale as Locale)
    const localeParams = [
      // Generate all possible URL patterns for the current locale
      ...rooms.flatMap((room: Room) => [
        // Room-painting combinations (e.g. /en-GB/room-1/painting-1-1)
        ...room.paintings.map(painting => ({
          slug: [locale, room.id, painting.id]
        })),
        // Individual room pages (e.g. /en-GB/room-1) 
        {
          slug: [locale, room.id]
        }
      ]),
      // Direct painting number access (e.g. /en-GB/painting-1)
      ...paintingIdNeeded.map(paintingId => ({
        slug: [locale, paintingId]
      }))
    ]
    allParams.push(...localeParams)

    // Add paths without locale prefix
    const noLocaleParams = [
      ...rooms.flatMap((room: Room) => [
        ...room.paintings.map(painting => ({
          slug: [room.id, painting.id]
        })),
        // Individual room pages (e.g. /room-1)
        {
          slug: [room.id]
        }
      ]),
      // Direct painting number access without locale (e.g. /painting-1)
      ...paintingIdNeeded.map(paintingId => ({
        slug: [paintingId]
      }))
    ]
    allParams.push(...noLocaleParams)
  }

  return allParams
}

export default async function Page({
  params
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug = [] } = await params
  // Add check for offline route
  if (slug[slug.length - 1] === 'offline') {
    return (
      <OfflinePage />
    )
  }

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
    // Root path: should be redirected by service worker, but if we get here, redirect
    redirect('/van-gogh/en-GB/room-1')
  } else if (cleanSlug.length === 1) {
    // Single segment: either locale or roomId
    if (SUPPORTED_LOCALES.includes(cleanSlug[0] as Locale)) {
      // Locale-only path: should be redirected by service worker, but if we get here, redirect
      redirect(`/van-gogh/${cleanSlug[0]}/room-1`)
    } else {
      // No locale prefix - use default locale
      roomId = cleanSlug[0]
      locale = DEFAULT_LOCALE
    }
  } else if (cleanSlug.length === 2) {
    if (SUPPORTED_LOCALES.includes(cleanSlug[0] as Locale)) {
      locale = cleanSlug[0] as Locale
      roomId = cleanSlug[1]
    } else {
      // No locale prefix - redirect to default locale
      roomId = cleanSlug[0]
      paintingId = cleanSlug[1]
      redirect(`/van-gogh/${DEFAULT_LOCALE}/${roomId}${paintingId ? `/${paintingId}` : ''}`)
    }
  } else if (cleanSlug.length === 3) {
    if (!SUPPORTED_LOCALES.includes(cleanSlug[0] as Locale)) {
      // No locale prefix - redirect to default locale
      roomId = cleanSlug[0]
      paintingId = cleanSlug[1]
      const extraSegment = cleanSlug[2]
      redirect(`/van-gogh/${DEFAULT_LOCALE}/${roomId}${paintingId ? `/${paintingId}` : ''}${extraSegment ? `/${extraSegment}` : ''}`)
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
        // Redirect to the canonical URL format with locale
        redirect(`/van-gogh/${locale}/room-${painting.roomNumber}/${painting.id}`)
      }
    }
    // If we get here, painting number was invalid
    return notFound()
  }

  // Handle invalid room ID format or non-existent room
  if (!currentRoom || !currentRoom.paintings) {
    return notFound()
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
        redirect(`/van-gogh/${locale}/${currentRoom.id}/${currentPainting.id}`)
      }
    } else {
      // If painting doesn't exist in this room, redirect to room view
      redirect(`/van-gogh/${locale}/${roomId}`)
    }
  }

  return (
    <>
      <PaintingDetails
        currentRoom={currentRoom as Room}
        currentPainting={currentPainting}
        locale={locale}
      />
    </>
  )
}