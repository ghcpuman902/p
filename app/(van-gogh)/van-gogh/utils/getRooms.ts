import { promises as fs } from 'fs';
import { Painting, type Room } from '../types';

export async function getRooms(): Promise<Room[]> {
  const roomsJson = await fs.readFile(process.cwd() + '/public/van-gogh/rooms.json', 'utf8');
  const data = JSON.parse(roomsJson);

  return data.rooms.map((room: Room, index: number) => {
    const roomNumber = index + 1;
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
    };
  });
} 