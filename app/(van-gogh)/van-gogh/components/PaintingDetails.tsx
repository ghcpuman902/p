import Link from 'next/link';
import Image from 'next/image';
import { Room, Painting } from '../types';

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
            src={`/van-gogh/${displayData.image.url}`} 
            alt={displayData.image.description}
            width={800}
            height={600} 
          />
          <p className="text-muted-foreground">{displayData.image.description}</p>
        </div>
      )}
    </article>
  );
}

export default PaintingDetails