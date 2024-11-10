'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Map, Clock, Settings } from 'lucide-react';
import { type Room, type Painting, type DisplayItem } from '../types';

interface VanGoghGalleryProps {
  rooms: Room[];
  initialSequence: DisplayItem[];
}

export function VanGoghGallery({ rooms, initialSequence }: VanGoghGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentItem = initialSequence[currentIndex];
  const roomsContainerRef = useRef<HTMLDivElement>(null);
  const paintingsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentItem) return;

    const activeRoom = document.querySelector('[data-room-active="true"]');
    const activePainting = document.querySelector('[data-painting-active="true"]');

    activeRoom?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    
    if (activePainting) {
      const previousSeparator = activePainting.previousElementSibling;
      if (previousSeparator?.classList.contains('separator')) {
        previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      } else {
        activePainting.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  }, [currentIndex, currentItem]);

  const isPaintingActive = (painting: Painting) => {
    return currentItem?.type === 'painting' && currentItem.painting.paintingNumber === painting.paintingNumber;
  };

  const handleRoomSelection = (room: Room) => {
    const roomIntroIndex = initialSequence.findIndex(
      item => item.type === 'roomIntro' && item.roomIntro.roomTitle === room.roomTitle
    );
    
    const currentRoomIndex = rooms.findIndex(r => r.roomTitle === room.roomTitle);
    const previousRoom = rooms[currentRoomIndex - 1];
    
    if (previousRoom && currentItem?.type === 'painting' && 
        previousRoom.paintings.some(p => p.paintingNumber === currentItem.painting.paintingNumber)) {
      const lastPaintingIndex = initialSequence.findIndex(
        item => item.type === 'painting' && 
        item.painting.paintingNumber === room.paintings[room.paintings.length - 1].paintingNumber
      );
      if (lastPaintingIndex >= 0) setCurrentIndex(lastPaintingIndex);
    } else {
      const firstPaintingIndex = initialSequence.findIndex(
        item => item.type === 'painting' && 
        item.painting.paintingNumber === room.paintings[0].paintingNumber
      );
      setCurrentIndex(roomIntroIndex >= 0 ? roomIntroIndex : firstPaintingIndex);
    }

    setTimeout(() => {
      const firstPaintingButton = document.querySelector(`[data-painting-number="${room.paintings[0].paintingNumber}"]`);
      if (firstPaintingButton) {
        const previousSeparator = firstPaintingButton.previousElementSibling;
        if (previousSeparator?.classList.contains('separator')) {
          previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        } else {
          firstPaintingButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      }
    }, 0);
  };

  const handlePaintingSelection = (painting: Painting) => {
    const paintingIndex = initialSequence.findIndex(
      item => item.type === 'painting' && item.painting.paintingNumber === painting.paintingNumber
    );
    if (paintingIndex >= 0) setCurrentIndex(paintingIndex);
  };

  const handleNextItem = () => {
    if (currentIndex < initialSequence.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousItem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <nav className="bg-gray-100 p-2">
        <div className="max-w-full w-screen">
          <div 
            ref={roomsContainerRef}
            className="overflow-x-auto"
            style={{
              WebkitOverflowScrolling: 'touch',
              maxWidth: '100vw'
            }}
          >
            <div className="flex flex-nowrap">
              {rooms.map(room => (
                <Button
                  key={room.roomTitle}
                  data-room-active={currentItem && (
                    (currentItem.type === 'roomIntro' && currentItem.roomIntro.roomTitle === room.roomTitle) || 
                    (currentItem.type === 'painting' && room.paintings.some(p => p.paintingNumber === currentItem.painting.paintingNumber))
                  )}
                  variant={currentItem && (
                    (currentItem.type === 'roomIntro' && currentItem.roomIntro.roomTitle === room.roomTitle) || 
                    (currentItem.type === 'painting' && room.paintings.some(p => p.paintingNumber === currentItem.painting.paintingNumber))
                  ) ? "default" : "outline"}
                  className="rounded-none whitespace-nowrap flex-none mr-1"
                  onClick={() => handleRoomSelection(room)}
                >
                  {room.roomTitle}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-full mt-2">
          <div 
            ref={paintingsContainerRef}
            className="overflow-x-auto"
            style={{
              WebkitOverflowScrolling: 'touch',
              maxWidth: '100vw'
            }}
          >
            <div className="flex flex-nowrap items-center">
              {rooms.flatMap((room, roomIndex) => [
                // Render paintings for this room
                ...room.paintings.map((painting) => (
                  <Button
                    key={painting.paintingNumber}
                    data-painting-active={isPaintingActive(painting)}
                    data-painting-number={painting.paintingNumber}
                    variant={isPaintingActive(painting) ? "default" : "outline"}
                    onClick={() => handlePaintingSelection(painting)}
                    className="rounded-none w-10 flex-none mr-1"
                  >
                    {painting.paintingNumber}
                  </Button>
                )),
                // Add separator after each room except the last one
                roomIndex < rooms.length - 1 ? (
                  <div 
                    key={`separator-${room.roomTitle}`} 
                    className="h-6 w-[10px] bg-neutral-400 mr-1 rounded-full separator"
                  >&nbsp;</div>
                ) : null,
              ])}
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-grow p-4">
        {currentItem && (
          currentItem.type === 'roomIntro' ? (
            <>
              <h2 className="text-2xl font-bold mb-4">{currentItem.roomIntro.roomTitle}</h2>
              <p>{currentItem.roomIntro.roomIntroduction}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">{currentItem.painting.paintingNumber}. {currentItem.painting.paintingTitle}</h2>
              <p>{currentItem.painting.exhibitionText}</p>
            </>
          )
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center bg-gray-100 gap-0 p-0">
        <Button
          onClick={handlePreviousItem}
          disabled={currentIndex === 0}
          className="rounded-none h-full flex-auto m-0 flex items-center justify-start"
        >
          <ChevronLeft className="h-8 w-8" />
          <span className="ml-2">Previous</span>
        </Button>
        <div className="w-48 h-full flex items-center justify-center">
          <Button size="icon" className="rounded-none h-12 w-12">
            <Map className="h-6 w-6" />
          </Button>
          <Button size="icon" className="rounded-none h-12 w-12">
            <Clock className="h-6 w-6" />
          </Button>
          <Button size="icon" className="rounded-none h-12 w-12">
            <Settings className="h-6 w-6" />
          </Button>
        </div>
        <Button
          onClick={handleNextItem}
          disabled={currentIndex === initialSequence.length - 1}
          className="rounded-none h-full flex-auto m-0 flex items-center justify-end"
        >
          <span className="mr-2">Next</span>
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
} 