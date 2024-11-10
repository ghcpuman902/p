import { notFound, redirect } from 'next/navigation'
import { type Room, type Painting } from '../types'
import { getRooms } from '../utils/getRooms'
import PaintingDetails from '../components/PaintingDetails'
import { type PageProps } from '../types'
export async function generateStaticParams(): Promise<{ roomId: string, paintingId?: string }[]> {
    const rooms = await getRooms()
    
    // Generate params for room-painting combinations
    const roomPaintingParams = rooms.flatMap((room: Room) =>
        room.paintings.map((painting: Painting) => ({
            roomId: room.id,
            paintingId: painting.id
        }))
    )

    // Generate params for room IDs
    const roomParams = rooms.map((room: Room) => ({
        roomId: room.id
    }))

    // Generate params for painting numbers
    const paintingParams = rooms.flatMap((room: Room) => 
        room.paintings.map((painting: Painting) => ({
            roomId: `painting-${painting.paintingNumber}`
        }))
    )

    // Combine all params
    return [...roomPaintingParams, ...roomParams, ...paintingParams]
}

export default async function Page({ params }: PageProps) {
    const { roomId, paintingId } = await params
    const rooms = await getRooms()

    // First try to find room directly
    const currentRoom = rooms.find((room: Room) => room.id === roomId)
    let currentPainting = null
    
    // If room not found, check if it's a painting number
    if (!currentRoom && roomId.startsWith('painting-')) {
        const paintingNumber = roomId.split('-')[1]
        // Find painting across all rooms
        for (const room of rooms) {
            const painting = room.paintings.find(
                (p: Painting) => p.paintingNumber === paintingNumber
            )
            if (painting) {
                // Redirect to the canonical URL format
                redirect(`/van-gogh/room-${painting.roomNumber}/${painting.id}`)
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
        currentPainting = currentRoom.paintings.find(
            (painting: Painting) => painting.id === paintingId
        )
        if (!currentPainting) {
            // If painting doesn't exist in this room, redirect to room view
            redirect(`/van-gogh/${roomId}`)
        }
    }

    return (
        <PaintingDetails
            currentRoom={currentRoom}
            currentPainting={currentPainting}
        />
    )
}