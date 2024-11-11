import { getRooms } from "../van-gogh/utils/getRooms";


export default async function Page() {
    const rooms = await getRooms('zh-TW');

    return <div>{rooms.map((room) => <div key={room.id}>
        <h1>Room {room.roomNumber}: {room.roomTitle}</h1>
        <p>{room.roomIntroduction}</p>
        {room.paintings.map((painting) => <div key={painting.id}>
            <h2>{painting.paintingNumber} {painting.paintingTitle}</h2>
            <div>{painting.media} {painting.origin}</div>
            <div>{painting.exhibitionText}</div>
        </div>)}
    </div>)}</div>;
}