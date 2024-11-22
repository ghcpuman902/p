import Link from 'next/link';
import { Room, Painting } from '../libs/types';
import { cn } from '@/lib/utils';
import { getTranslation, Locale } from '@/app/(van-gogh)/van-gogh/libs/localization';
import { PaintingImage } from './PaintingImage';

// Helper function to transform text
function transformText(text: string, locale: Locale): JSX.Element[] {
  const parts = text.split(/(\n\n|\n|\*\*\*\*|\*\*|\(\d{1,2}\))/g);
  return parts.map((part, index) => {
    if (part === '\n\n') return <p key={index} className="leading-7 mt-6"></p>;
    if (part === '\n') return <br key={index} />;
    if (part === '****') return <strong key={index}></strong>;
    if (part === '**') return <em key={index}></em>;
    const match = part.match(/[(\（](\d{1,2})[)\）]/);
    if (match) return (
      <Link key={index} className="font-medium underline underline-offset-4" href={`/van-gogh/${locale}/painting-${match[1]}`}>
        {locale === 'zh-CN' || locale === 'zh-TW' ? `（${match[1]}）` : `(${match[1]})`}
      </Link>
    );
    return <span key={index}>{part}</span>;
  });
}

// Helper function to format Chinese titles
function formatChineseTitle(title: string): string {
  return title
    .replace(/《|》/g, '')  // Remove Chinese book/title marks
    .replace(/\s?\(/g, '（') // Replace western parentheses with Chinese ones
    .replace(/\)\s?/g, '）');
}

interface PaintingDetailsProps {
  currentRoom: Room;
  currentPainting?: Painting | null;
  locale: Locale;
}

function PaintingDetails({ currentRoom, currentPainting, locale }: PaintingDetailsProps) {
  // Unified structure for both room and painting display
  const displayData = currentPainting ? {
    number: currentPainting.paintingNumber,
    title: locale === "zh-TW" || locale === "zh-CN" 
      ? formatChineseTitle(currentPainting.paintingTitle)
      : currentPainting.paintingTitle,
    text: currentPainting.exhibitionText,
    image: currentPainting.image,
    details: [
      currentPainting.media,
      currentPainting.origin
    ].filter(Boolean)
  } : {
    number: currentRoom.paintings.length ?
      `${currentRoom.paintings[0].paintingNumber}-${currentRoom.paintings[currentRoom.paintings.length - 1].paintingNumber}` :
      getTranslation(locale, "end"),
    title: currentRoom.paintings.length ?
      locale === "zh-TW" || locale === "zh-CN"
        ? formatChineseTitle(`${getTranslation(locale, "room")} ${currentRoom.roomNumber}: ${currentRoom.roomTitle}`)
        : `${getTranslation(locale, "room")} ${currentRoom.roomNumber}: ${currentRoom.roomTitle}`
      : formatChineseTitle(currentRoom.roomTitle),
    text: currentRoom.roomIntroduction,
    image: currentRoom.roomImage,
    details: []
  };

  return (
    <div className={cn(
      "w-full h-full min-h-screen pb-[calc(48px+1rem)]",
      !currentPainting && "bg-secondary text-white"
    )}>
      <article className={cn(
        "max-w-2xl mx-auto p-6 space-y-6 transition-all duration-300"
      )}>
        <div className="h-24 p-8">&nbsp;</div>
        <div className={cn(
          "text-[100px] md:text-[120px] font-light leading-none z-0",
          !currentPainting ? "text-[hsla(176,56%,64%,0.8)] dark:text-[hsl(var(--secondary)/0.8)]" : "text-[hsl(var(--secondary-invert))]"
        )}
          style={{
            textShadow: "rgba(255,255,255,0.2) 0px 0.5px, rgba(0,0,0,0.8) 0px -0.5px"
          }}
        >
          {displayData.number}
        </div>

        <h2 className={cn("font-light leading-tight",
          ["zh-TW", "zh-CN"].includes(locale) ? "pr-5 text-3xl" : "text-4xl",
          !currentPainting ? "text-white" : "text-[hsl(var(--secondary-invert))]"
        )}>
          {displayData.title}
        </h2>

        {displayData.image && (
          <PaintingImage 
            imageUrl={displayData.image.url}
            description={displayData.image.description}
            locale={locale}
            isPainting={!!currentPainting}
          />
        )}

        <div className="leading-7 [&:not(:first-child)]:mt-6">
          {transformText(displayData.text, locale)}
        </div>

        {displayData.details.length > 0 && (
          <div className="space-y-1">
            {displayData.details.map((detail, index) => (
              <p key={index} className="text-gray-500">{detail}</p>
            ))}
          </div>
        )}

      </article>
    </div>
  );
}

export default PaintingDetails

