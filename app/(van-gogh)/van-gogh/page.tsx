import { promises as fs } from 'fs';
import { VanGoghGallery } from './components/VanGoghGallery';
import { type Room, type Painting, type DisplayItem } from './types';    

function convertToDisplaySequence(rooms: Room[]): DisplayItem[] {
  return rooms.flatMap(room => [
    { 
      type: 'roomIntro' as const,
      roomIntro: room
    },
    ...room.paintings.map(painting => ({
      type: 'painting' as const,
      painting
    }))
  ]);
}

export default async function Page() {
  const roomsJson = await fs.readFile(process.cwd() + '/public/textJsonByRooms/rooms.json', 'utf8');
  const data = JSON.parse(roomsJson);
  
  // Add type to paintings when parsing the JSON
  const rooms: Room[] = data.rooms.map((room: any) => ({
    ...room,
    paintings: room.paintings.map((painting: any) => ({
      ...painting,
      type: 'painting' as const
    }))
  }));
  
  const displaySequence = convertToDisplaySequence(rooms);

  return <VanGoghGallery rooms={rooms} initialSequence={displaySequence} />;
}
