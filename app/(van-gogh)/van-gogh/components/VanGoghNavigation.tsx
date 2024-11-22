'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { usePathname, useSelectedLayoutSegments, useRouter } from 'next/navigation'
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { type Room, type Painting } from '../libs/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ExhibitionMapDrawer } from './ExhibitionMapDrawer'
import { ChronologyDrawer } from './ChronologyDrawer'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, Locale, getTranslation } from '../libs/localization'
import { LanguageDrawer } from './LanguageDrawer'

interface VanGoghNavigationProps {
    roomOptions: {
        [K in Locale]: Room[]
    }
    children: React.ReactNode
}

export function VanGoghNavigation({ roomOptions, children }: VanGoghNavigationProps) {
    const pathname = usePathname()
    const segments = useSelectedLayoutSegments()
    const router = useRouter()

    // In Next.js layout components, normal useState values reset on route changes
    // but refs persist across route changes. We use this to track audio state
    const wasPlayingRef = useRef(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    
    // These states will reset on route changes, but that's okay because
    // we use wasPlayingRef to determine if we should restart playback
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [audioSrc, setAudioSrc] = useState<string | null>(null)

    // Clean up segments to handle multiple locales
    const getLocaleFromSegments = (segs: string[]): Locale => {
        const expandedSegs = segs.flatMap(seg => seg.split('/'))
        const localeSegments = expandedSegs
            .filter(seg => SUPPORTED_LOCALES.includes(seg as Locale))
        return localeSegments.length > 0 
            ? localeSegments[localeSegments.length - 1] as Locale
            : DEFAULT_LOCALE
    }

    const locale = getLocaleFromSegments(segments)
    const rooms = roomOptions[locale]
    const roomsContainerRef = useRef<HTMLDivElement>(null)
    const paintingsContainerRef = useRef<HTMLDivElement>(null)

    // More defensive URL parsing
    const pathParts = pathname.split('van-gogh/')[1]?.split('/') || []
    
    // Clean up pathParts to handle multiple locales
    const cleanPathParts = (() => {
        const localeIndexes = pathParts
            .map((part, index) => SUPPORTED_LOCALES.includes(part as Locale) ? index : -1)
            .filter(index => index !== -1)

        // If multiple locales found, use everything after the last locale
        if (localeIndexes.length > 1) {
            return pathParts.slice(localeIndexes[localeIndexes.length - 1])
        }
        return pathParts
    })()

    let [currentLocale, currentRoomId, currentPaintingId] = cleanPathParts as [Locale, string, string]

    // Handle cases where locale is not in the URL
    if (!SUPPORTED_LOCALES.includes(currentLocale as Locale)) {
        currentPaintingId = currentRoomId
        currentRoomId = currentLocale
        currentLocale = locale
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
            // Find the active room's data
            const activeRoomData = rooms.find(r => r.id === activeRoom.getAttribute('data-room-id'))

            // Only try to scroll to first painting if the room has paintings
            if (activeRoomData?.paintings.length) {
                const firstPainting = document.querySelector(`[data-painting-id="${activeRoomData.paintings[0].id}"]`);
                if (firstPainting) {
                    const previousSeparator = firstPainting.previousElementSibling
                    if (previousSeparator?.classList.contains('separator')) {
                        // Scroll to previous separator
                        previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                    } else {
                        firstPainting.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                    }
                }
            }
        } else if (activePainting) {
            // Scroll to previous separator or painting
            const previousSeparator = activePainting.previousElementSibling
            if (previousSeparator?.classList.contains('separator')) {
                // Scroll to previous separator
                previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            } else {
                // Scroll to previous painting
                activePainting.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                // ADD 8px to the left of the parent scroll container
                const parentScrollContainer = activePainting.parentElement
                if (parentScrollContainer) {
                    parentScrollContainer.scrollLeft += 100
                }
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
                return `/van-gogh/${currentLocale}/${currentRoomId}/${previousPainting.id}`;
            } else {
                return `/van-gogh/${currentLocale}/${currentRoomId}`;
            }
        } else if (currentRoomIndex > 0) {
            const previousRoom = rooms[currentRoomIndex - 1];
            const lastPainting = previousRoom.paintings[previousRoom.paintings.length - 1];
            return `/van-gogh/${currentLocale}/${previousRoom.id}/${lastPainting.id}`;
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
            return `/van-gogh/${currentLocale}/${currentRoomId}/${nextPainting.id}`;
        } else if (currentRoomIndex < rooms.length - 1) {
            const nextRoom = rooms[currentRoomIndex + 1];
            return `/van-gogh/${currentLocale}/${nextRoom.id}`;
        }
        return null;
    }

    // Modify the isOffline state initialization
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Set initial online status only after component mounts
        setIsOffline(!window.navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Function to safely set up new audio source and handle playback
    const setAudioSource = useCallback(async () => {
        // Always clean up existing audio first to prevent memory leaks
        // and avoid the AbortError when loading new audio
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            audioRef.current.src = ''
            audioRef.current.load()
        }

        // Set up new audio source
        const audioPath = currentPaintingId 
            ? `/van-gogh-assets/${currentLocale}.${currentPaintingId}.aac`
            : `/van-gogh-assets/${currentLocale}.${currentRoomId}.aac`

        setAudioSrc(audioPath)
        
        // Wait for next tick to ensure audio element has updated
        // This prevents race conditions with audio loading
        await new Promise(resolve => setTimeout(resolve, 0))
        
        // If audio was playing before navigation, resume playback
        if (wasPlayingRef.current && audioRef.current) {
            try {
                await audioRef.current.play()
                setIsPlaying(true)
            } catch (error) {
                console.error('Error playing audio:', error)
                setIsPlaying(false)
                wasPlayingRef.current = false
            }
        }
    }, [currentLocale, currentPaintingId, currentRoomId])

    // Function to safely start audio playback
    const playAudio = useCallback(async () => {
        if (audioRef.current) {
            try {
                if (isOffline) {
                    const cache = await caches.open('van-gogh-assets');
                    const audioPath = currentPaintingId 
                        ? `/van-gogh-assets/${currentLocale}.${currentPaintingId}.aac`
                        : `/van-gogh-assets/${currentLocale}.${currentRoomId}.aac`;
                    const cachedResponse = await cache.match(audioPath);
                    
                    if (!cachedResponse) {
                        throw new Error('Audio not cached');
                    }
                }
                
                await audioRef.current.play();
                setIsPlaying(true);
                wasPlayingRef.current = true;
            } catch (error) {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
                wasPlayingRef.current = false;
            }
        }
    }, [isOffline, currentPaintingId, currentLocale, currentRoomId]);

    // Handle navigation while preserving audio state
    const handleNavigation = (url: string | null) => {
        if (url) {
            // Store playing state in ref so it persists across route change
            wasPlayingRef.current = isPlaying

            // Clean up current audio before navigation
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }

            router.push(url)
        }
    }

    // Effect runs on pathname changes (route changes)
    // This is where we handle audio setup after navigation
    useEffect(() => {
        setAudioSource()

        // Store ref in a variable that's captured in the closure
        const audio = audioRef.current

        // Cleanup function runs before next effect and on unmount
        return () => {
            if (audio) {
                audio.pause()
                audio.currentTime = 0
                audio.src = ''
                audio.load()
            }
        }
    }, [pathname, setAudioSource])

    // Toggle audio playback
    const toggleAudio = () => {
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause()
                setIsPlaying(false)
                wasPlayingRef.current = false
            }
        } else {
            playAudio()
        }
    }

    // Add these new handlers for progress bar interaction
    const handleProgressBarInteraction = (event: React.MouseEvent | React.TouchEvent) => {
        if (!audioRef.current) return;
        
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        
        // Get X position from either mouse or touch event
        const clientX = 'touches' in event 
            ? event.touches[0].clientX 
            : event.clientX;
        
        const position = (clientX - rect.left) / rect.width;
        const newTime = position * audioRef.current.duration;
        
        // Update audio position
        audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
        setProgress(position * 100);
    };

    // Add these states for tracking touch/drag
    const [isDragging, setIsDragging] = useState(false);

    // Add useEffect for handling document-wide mouse/touch events
    useEffect(() => {
        const handleMove = (event: MouseEvent | TouchEvent) => {
            if (!isDragging || !audioRef.current) return;
            
            const progressBar = document.querySelector('.progress-bar');
            if (!progressBar) return;
            
            const rect = progressBar.getBoundingClientRect();
            const clientX = 'touches' in event 
                ? event.touches[0].clientX 
                : event.clientX;
            
            const position = (clientX - rect.left) / rect.width;
            const newTime = position * audioRef.current.duration;
            
            audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
            setProgress(Math.max(0, Math.min(position * 100, 100)));
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('touchmove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchend', handleEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0">
                <div className="max-w-full w-screen pt-2 pb-1 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75">
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
                                    className={cn("rounded-none whitespace-nowrap flex-none mr-1 first:ml-2 h-12",
                                        room.id === currentRoomId ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground active:bg-secondary/60 active:text-secondary-foreground" : "opacity-60 dark:opacity-60 hover:opacity-80")}
                                    asChild
                                >
                                    <Link href={`/van-gogh/${locale}/${room.id}`}>
                                        {room.paintings.length ? `${room.roomNumber}: ${room.roomTitle}` : getTranslation(locale, "end")}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-full p-0 pb-2 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75">
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
                                ...(room.paintings.length ? room.paintings.map((painting: Painting) => (
                                    <Button
                                        key={painting.id}
                                        data-painting-active={painting.id === currentPaintingId}
                                        data-painting-id={painting.id}
                                        data-painting-number={painting.paintingNumber}
                                        className={cn("rounded-none w-12 h-12 flex-none mr-1 first:ml-2",
                                            painting.id === currentPaintingId && "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground active:bg-secondary/60 active:text-secondary-foreground",
                                            room.id === currentRoomId ? "border-b-4 border-b-secondary" : "opacity-60 dark:opacity-60 hover:opacity-80")}
                                        style={{
                                            boxShadow: "hsl(var(--secondary)) 0px 10px 0px 0px"
                                        }}
                                        asChild
                                    >
                                        <Link href={`/van-gogh/${currentLocale}/${room.id}/${painting.id}`}>
                                            {painting.paintingNumber}
                                        </Link>
                                    </Button>
                                )) : []),
                                roomIndex < rooms.length - 1 && rooms[roomIndex + 1].paintings.length ? (
                                    <div
                                        key={`separator-${room.roomTitle}`}
                                        className="h-6 w-[10px] bg-neutral-400 mr-1 rounded-full separator "
                                    >&nbsp;</div>
                                ) : null,
                            ])}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 bg-transparent justify-end p-2">
                    <ChronologyDrawer lang={currentLocale} />
                    <ExhibitionMapDrawer lang={currentLocale} />
                    <LanguageDrawer 
                        currentLocale={currentLocale}
                        rooms={rooms}
                    />
                </div>
            </nav>

            <main>
                {children}
            </main>

            <div className="fixed bottom-0 left-0 right-0">
                <div className="flex justify-stretch gap-2 bg-transparent">
                    <BottomNaButton
                        className="rounded-tr-xl"
                        onClick={() => {
                            const prevUrl = getPreviousUrl()
                            if (prevUrl) router.push(prevUrl)
                        }}
                        disabled={!getPreviousUrl()}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </BottomNaButton>
                    <BottomNaButton
                        className="rounded-t-xl"
                        onClick={toggleAudio}
                        disabled={!currentRoomId}
                    >
                        <span className="ml-1">{getTranslation(locale, "playAudio")}</span>
                        {isPlaying ? (
                            <Pause className="h-6 w-6" />
                        ) : (
                            <Play className="h-6 w-6" />
                        )}
                    </BottomNaButton>
                    <BottomNaButton
                        className="rounded-tl-xl"
                        onClick={() => handleNavigation(getNextUrl())}
                        disabled={!getNextUrl()}
                    >
                        <span className="mr-2">{getTranslation(locale, "next")}</span>
                        <ChevronRight className="h-6 w-6" />
                    </BottomNaButton>
                </div>

                <div 
                    className="w-full h-4 bg-gray-200 dark:bg-gray-700 cursor-pointer progress-bar touch-none"
                    onClick={handleProgressBarInteraction}
                    onTouchStart={(e) => {
                        setIsDragging(true);
                        handleProgressBarInteraction(e);
                    }}
                    onMouseDown={(e) => {
                        setIsDragging(true);
                        handleProgressBarInteraction(e);
                    }}
                    onTouchMove={handleProgressBarInteraction}
                    onMouseMove={(e) => {
                        if (isDragging) {
                            handleProgressBarInteraction(e);
                        }
                    }}
                    onTouchEnd={() => setIsDragging(false)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                >
                    <div 
                        className="h-full bg-blue-500 transition-all duration-100 ease-in-out" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            {audioSrc && (
                <audio
                    ref={audioRef}
                    src={audioSrc}
                    onError={(e) => {
                        console.warn("Audio Error:", e)
                        setIsPlaying(false)
                        wasPlayingRef.current = false
                    }}
                    onTimeUpdate={() => {
                        if (audioRef.current) {
                            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
                        }
                    }}
                    onEnded={() => {
                        setIsPlaying(false)
                        wasPlayingRef.current = false
                        setProgress(0)
                    }}
                />
            )}
        </>
    )
}

const BottomNaButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    function BottomNaButton({ className, variant, size, asChild = false, ...props }, ref) {
        return (
            <Button
                className={cn(buttonVariants({ variant, size, className }), "h-12 flex-1 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90", className)}
                ref={ref}
                {...props}
                asChild={asChild}
            />
        )
    }
)