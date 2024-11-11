import Link from 'next/link';
import Image from 'next/image';
import { Room, Painting } from '../types';
import painting21 from '@/public/van-gogh/p21.png'
import painting27 from '@/public/van-gogh/p27.png'
import painting33 from '@/public/van-gogh/p33.png'
import painting44 from '@/public/van-gogh/p44.png'
import painting8 from '@/public/van-gogh/p8.png'
import room3 from '@/public/van-gogh/r3.png'
import room6 from '@/public/van-gogh/r6.png'

// Helper function to transform text
function transformText(text: string): JSX.Element[] {
  const parts = text.split(/(\n\n|\n|\*\*\*\*|\*\*|\(\d{1,2}\))/g);
  return parts.map((part, index) => {
    if (part === '\n\n') return <p key={index} className="leading-7 mt-6"></p>;
    if (part === '\n') return <br key={index} />;
    if (part === '****') return <strong key={index}></strong>;
    if (part === '**') return <em key={index}></em>;
    const match = part.match(/\((\d{1,2})\)/);
    if (match) return (
      <Link key={index} className="font-medium text-primary underline underline-offset-4" href={`/van-gogh/painting-${match[1]}`}>
        ({match[1]})
      </Link>
    );
    return <span key={index}>{part}</span>;
  });
}

interface PaintingDetailsProps {
  currentRoom: Room;
  currentPainting?: Painting | null;
}

function PaintingDetails({ currentRoom, currentPainting }: PaintingDetailsProps) {
  // Unified structure for both room and painting display
  const displayData = currentPainting ? {
    number: currentPainting.paintingNumber,
    title: currentPainting.paintingTitle,
    text: currentPainting.exhibitionText,
    image: currentPainting.image,
    details: [
      currentPainting.media,
      currentPainting.origin
    ].filter(Boolean)
  } : {
    number: `${currentRoom.paintings[0].paintingNumber}-${currentRoom.paintings[currentRoom.paintings.length - 1].paintingNumber}`,
    title: `Room ${currentRoom.roomNumber}: ${currentRoom.roomTitle}`,
    text: currentRoom.roomIntroduction,
    image: currentRoom.roomImage,
    details: []
  };

  const paintingImages = {
    'p21.png': painting21,
    'p27.png': painting27,
    'p33.png': painting33,
    'p44.png': painting44,
    'p8.png': painting8,
    'r3.png': room3,
    'r6.png': room6
  }

  return (
    <article className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-[100px] md:text-[120px] font-light leading-none text-[hsl(var(--secondary-invert))] tracking-tighter">
        {displayData.number}
      </div>
      
      <h2 className="text-4xl font-light leading-tight text-[hsl(var(--secondary-invert))]">
        {displayData.title}
      </h2>
      
      <div className="leading-7 [&:not(:first-child)]:mt-6">
        {transformText(displayData.text)}
      </div>

      {displayData.details.length > 0 && (
        <div className="space-y-1">
          {displayData.details.map((detail, index) => (
            <p key={index} className="text-gray-500">{detail}</p>
          ))}
        </div>
      )}

      {displayData.image && (
        <div className="flex flex-col items-center my-4">
          <Image 
            src={paintingImages[displayData.image.url as keyof typeof paintingImages] || `/van-gogh/${displayData.image.url}`}
            alt={displayData.image.description}
            priority
            quality={100}
            className="w-full h-auto"
          />
          <p className="text-muted-foreground mt-2">{displayData.image.description}</p>
        </div>
      )}
    </article>
  );
}

export default PaintingDetails