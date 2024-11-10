import { notFound, redirect } from 'next/navigation'
import { type Room, type Painting } from '../../types'
import { getRooms } from '../../utils/getRooms'
import PaintingDetails from '../../components/PaintingDetails'


export async function generateStaticParams(): Promise<{ roomId: string, paintingId: string }[]> {
    const rooms = await getRooms()
    
    // Generate params for room-painting combinations only
    return rooms.flatMap((room: Room) =>
        room.paintings.map((painting: Painting) => ({
            roomId: room.id,
            paintingId: painting.id
        }))
    )
}

export default async function Page({ params }: {
  params: Promise<{ roomId: string; paintingId: string }>
}) {
  const { roomId, paintingId } = await params
  const rooms = await getRooms()
  
  // Try to find room first
  const currentRoom = rooms.find((room: Room) => room.id === roomId)
  if (!currentRoom) notFound()
  
  // Check if paintingId is a painting number
  if (paintingId.match(/^\d+$/)) {
    const painting = currentRoom.paintings.find(
      (p: Painting) => p.paintingNumber === paintingId
    )
    if (painting) {
      // Redirect to canonical URL format
      redirect(`/van-gogh/${roomId}/${painting.id}`)
    }
  }

  // Find painting by ID
  const currentPainting = currentRoom.paintings.find(
    (painting: Painting) => painting.id === paintingId
  )
  
  // If painting doesn't exist in this room, redirect to room view
  if (!currentPainting) {
    redirect(`/van-gogh/${roomId}`)
  }

  return (
    <PaintingDetails
      currentRoom={currentRoom}
      currentPainting={currentPainting}
    />
  )
}