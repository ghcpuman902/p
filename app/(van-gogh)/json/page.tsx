import { getRooms } from "../van-gogh/libs/getRooms";

export default async function Page() {
    const rooms = await getRooms('zh-TW');

    return (<div className="fixed inset-0 overflow-y-auto z-50 pt-20">{
        rooms.map((room) => (
            <div key={room.id}>
                <h1>{`#${room.roomNumber} ${room.roomTitle}`}</h1>
                <p>{room.roomIntroduction}</p>
                {
                    room.paintings.map((painting) => (
                        <div key={painting.id}>
                            <h2>{`##${painting.paintingNumber} ${painting.paintingTitle}`}</h2>
                            <strong className="font-bold">{`**${painting.media} ${painting.origin}**`}</strong>
                            <div>{painting.exhibitionText}</div>
                        </div>)
                    )
                }
            </div>)
        )
    }</div>);
}
