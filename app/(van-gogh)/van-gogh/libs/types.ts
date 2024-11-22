export interface PageProps {
    params: Promise<{
        roomId: string;
        paintingId: string;
    }>;
}


export interface RoomImage {
  url: string;
  description: string;
}

export interface PaintingImage {
  url: string;
  description: string;
}

export interface Painting {
  type: 'painting';
  id: string;
  paintingNumber: string;
  roomNumber: number;
  paintingTitle: string;
  paintingTime: string;
  media: string;
  origin: string;
  exhibitionText: string;
  image: PaintingImage | null;
}

export interface Room {
  id: string;
  roomTitle: string;
  roomNumber: number;
  roomIntroduction: string;
  roomImage: RoomImage;
  paintings: Painting[];
}

// Define the types for our display items
export type RoomIntroItem = {
  type: 'roomIntro';
  roomIntro: Room;
  painting?: never;
};

export type PaintingItem = {
  type: 'painting';
  roomIntro?: never;
  painting: Painting;
};

export type DisplayItem = NonNullable<RoomIntroItem | PaintingItem>;