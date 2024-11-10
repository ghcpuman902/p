import { redirect } from 'next/navigation';
import { getRooms } from './utils/getRooms';


export default async function Page() {
  const rooms = await getRooms();

  const firstRoom = rooms[0];
  const firstPainting = firstRoom.paintings[0];

  redirect(`/van-gogh/${firstRoom.id}/${firstPainting.id}`);
}
