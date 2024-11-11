'use client'

import React, { useRef, useEffect } from 'react'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Earth } from 'lucide-react'
import { type Room, type Painting } from '../types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ExhibitionMapDrawer } from './ExhibitionMapDrawer'
import { ChronologyDrawer } from './ChronologyDrawer'

const SUPPORTED_LANGUAGES = ['en-GB', 'zh-TW'] as const
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]
const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0]

interface VanGoghNavigationProps {
    roomOptions: {
        [K in SupportedLanguage]: Room[]
    }
    children: React.ReactNode
}

export function VanGoghNavigation({ roomOptions, children }: VanGoghNavigationProps) {
    const pathname = usePathname()
    const segments = useSelectedLayoutSegments()
    const lang = segments[1] && SUPPORTED_LANGUAGES.includes(segments[1].split('/')[0] as SupportedLanguage) 
        ? (segments[1].split('/')[0] as SupportedLanguage) 
        : DEFAULT_LANGUAGE
    const rooms = roomOptions[lang]
    const roomsContainerRef = useRef<HTMLDivElement>(null)
    const paintingsContainerRef = useRef<HTMLDivElement>(null)

    // More defensive URL parsing
    const pathParts = pathname.split('van-gogh/')[1]?.split('/') || []
    let [currentLang, currentRoomId, currentPaintingId] = pathParts as [SupportedLanguage, string, string]

    // Handle cases where language is not in the URL
    if (!SUPPORTED_LANGUAGES.includes(currentLang as SupportedLanguage)) {
        currentPaintingId = currentRoomId
        currentRoomId = currentLang
        currentLang = lang as SupportedLanguage
    }

    // Only attempt to process valid room/painting IDs
    if (currentRoomId?.startsWith('painting-')) {
        const paintingNumber = currentRoomId.split('-')[1]
        const painting = rooms.flatMap((room: Room) => room.paintings)
            .find((painting: Painting) => painting.paintingNumber === paintingNumber)
        
        if (painting) {
            currentRoomId = `room-${painting.roomNumber}`
            currentPaintingId = painting.id
        }
    }

    // Validate that currentRoomId exists in rooms
    const isValidRoom = rooms.some((room: Room) => room.id === currentRoomId)
    const currentRoom = rooms.find((room: Room) => room.id === currentRoomId)
    const isValidPainting = currentRoom?.paintings.some((painting: Painting) => painting.id === currentPaintingId)

    // If invalid, don't highlight anything but still render the navigation
    if (!isValidRoom) {
        currentRoomId = ''
        currentPaintingId = ''
    } else if (!isValidPainting) {
        currentPaintingId = ''
    }

    useEffect(() => {
        const activeRoom = document.querySelector('[data-room-active="true"]')
        const activePainting = document.querySelector('[data-painting-active="true"]')

        activeRoom?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

        if (!activePainting && activeRoom) {
            // Scroll to the first painting of the active room if no painting is active
            const firstPainting = document.querySelector(`[data-painting-id="${rooms.find(r => r.id === activeRoom.getAttribute('data-room-id'))?.paintings[0].id}"]`);
            if (firstPainting) {
                const previousSeparator = firstPainting.previousElementSibling
                if (previousSeparator?.classList.contains('separator')) {
                    previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                } else {
                    firstPainting.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                }
            }
        } else if (activePainting) {
            const previousSeparator = activePainting.previousElementSibling
            if (previousSeparator?.classList.contains('separator')) {
                previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            } else {
                activePainting.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            }
        }
    }, [rooms, currentRoomId, currentPaintingId])

    // Calculate previous and next URLs
    const getPreviousUrl = () => {
        if (!isValidRoom) return null;
        
        const currentRoomIndex = rooms.findIndex(room => room.id === currentRoomId);
        const currentRoom = rooms[currentRoomIndex];
        
        if (currentPaintingId && isValidPainting) {
            const currentPaintingIndex = currentRoom.paintings.findIndex(painting => painting.id === currentPaintingId);
            if (currentPaintingIndex > 0) {
                const previousPainting = currentRoom.paintings[currentPaintingIndex - 1];
                return `/van-gogh/${currentLang}/${currentRoomId}/${previousPainting.id}`;
            } else {
                return `/van-gogh/${currentLang}/${currentRoomId}`;
            }
        } else if (currentRoomIndex > 0) {
            const previousRoom = rooms[currentRoomIndex - 1];
            const lastPainting = previousRoom.paintings[previousRoom.paintings.length - 1];
            return `/van-gogh/${currentLang}/${previousRoom.id}/${lastPainting.id}`;
        }
        return null;
    }

    const getNextUrl = () => {
        if (!isValidRoom) return null;
        
        const currentRoomIndex = rooms.findIndex(room => room.id === currentRoomId);
        const currentRoom = rooms[currentRoomIndex];
        
        if (!currentRoom) return null;
        
        const currentPaintingIndex = currentPaintingId ? 
            currentRoom.paintings.findIndex(painting => painting.id === currentPaintingId) :
            -1;

        if (currentPaintingIndex < currentRoom.paintings.length - 1) {
            const nextPainting = currentRoom.paintings[currentPaintingIndex + 1];
            return `/van-gogh/${currentLang}/${currentRoomId}/${nextPainting.id}`;
        } else if (currentRoomIndex < rooms.length - 1) {
            const nextRoom = rooms[currentRoomIndex + 1];
            return `/van-gogh/${currentLang}/${nextRoom.id}`;
        }
        return null;
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col">
                <nav className="bg-zinc-100 dark:bg-black p-2">
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
                                        data-room-active={room.id === currentRoomId}
                                        data-room-id={room.id}
                                        data-room-number={room.roomNumber}
                                        className={cn("rounded-none whitespace-nowrap flex-none mr-1 h-12", room.id === currentRoomId && "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground active:bg-secondary active:text-secondary-foreground")}
                                        asChild
                                    >
                                        <Link href={`/van-gogh/${currentLang}/${room.id}`}>
                                            {`${room.roomNumber}: ${room.roomTitle}`}
                                        </Link>
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
                                    ...room.paintings.map((painting: Painting) => (
                                        <Button
                                            key={painting.id}
                                            data-painting-active={painting.id === currentPaintingId}
                                            data-painting-id={painting.id}
                                            data-painting-number={painting.paintingNumber}
                                            className={cn("rounded-none w-12 h-12 flex-none mr-1", painting.id === currentPaintingId && "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground active:bg-secondary active:text-secondary-foreground")}
                                            asChild
                                        >
                                            <Link href={`/van-gogh/${currentLang}/${room.id}/${painting.id}`}>
                                                {painting.paintingNumber}
                                            </Link>
                                        </Button>
                                    )),
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
                <main className="overflow-y-auto" style={{ height: 'calc(100vh - 48px)', paddingBottom: 'calc(48px + 1rem)' }}>
                    {children}
                </main>
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center bg-transparent gap-4 p-2">
                <div className="flex gap-2">
                    <ExhibitionMapDrawer lang={currentLang} />
                    <ChronologyDrawer />
                    <Button size="icon" className="rounded-full h-12 w-12" asChild>
                        <Link href={`/van-gogh/${SUPPORTED_LANGUAGES[(SUPPORTED_LANGUAGES.indexOf(currentLang) + 1) % SUPPORTED_LANGUAGES.length]}/${currentRoomId}${currentPaintingId ? `/${currentPaintingId}` : ''}`}>
                            <Earth className="h-6 w-6" />
                        </Link>
                    </Button>
                </div>
                <div className="flex">
                    <Button 
                        className="rounded-l-full h-12 flex items-center justify-center border-r border-border/50 px-4 bg-primary text-primary-foreground hover:bg-primary/90" 
                        asChild
                        disabled={!getPreviousUrl()}
                    >
                        <Link href={getPreviousUrl() ?? '#'}>
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <Button 
                        className="rounded-r-full h-12 flex items-center justify-center px-4 bg-primary text-primary-foreground hover:bg-primary/90" 
                        asChild
                        disabled={!getNextUrl()}
                    >
                        <Link href={getNextUrl() ?? '#'}>
                            <span className="mr-2">{currentLang === 'zh-TW' ? '下一個' : 'Next'}</span>
                            <ChevronRight className="h-6 w-6" />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    )
}