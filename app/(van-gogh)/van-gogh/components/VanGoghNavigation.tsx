'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { usePathname, useSelectedLayoutSegments, useRouter } from 'next/navigation'
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { type Room, type Painting } from '../libs/types'
import { cn } from '@/lib/utils'
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

// Add this constant near the top of the file
const DEFAULT_PLAYBACK_SPEED = 1.1

export function VanGoghNavigation({ roomOptions, children }: VanGoghNavigationProps) {
    const pathname = usePathname()
    const segments = useSelectedLayoutSegments()
    const router = useRouter()

    // Audio state management - simplified
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
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

    // Scroll to active elements - simplified
    useEffect(() => {
        const activeRoom = document.querySelector('[data-room-active="true"]')
        const activePainting = document.querySelector('[data-painting-active="true"]')

        activeRoom?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

        if (!activePainting && activeRoom) {
            const activeRoomData = rooms.find(r => r.id === activeRoom.getAttribute('data-room-id'))
            if (activeRoomData?.paintings.length) {
                const firstPainting = document.querySelector(`[data-painting-id="${activeRoomData.paintings[0].id}"]`);
                if (firstPainting) {
                    const previousSeparator = firstPainting.previousElementSibling
                    if (previousSeparator?.classList.contains('separator')) {
                        previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                    } else {
                        firstPainting.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                    }
                }
            }
        } else if (activePainting) {
            const previousSeparator = activePainting.previousElementSibling
            if (previousSeparator?.classList.contains('separator')) {
                previousSeparator.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            } else {
                activePainting.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
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

    // Simplified audio source setting - let service worker handle caching
    const setAudioSource = useCallback(() => {
        // Cancel any ongoing operations
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        // Basic validation
        if (!currentRoomId && !currentPaintingId) {
            setAudioSrc(null)
            setIsPlaying(false)
            return
        }

        // Set audio source - let service worker handle availability
        const audioPath = currentPaintingId
            ? `/van-gogh-assets/${currentLocale}.${currentPaintingId}.aac`
            : `/van-gogh-assets/${currentLocale}.${currentRoomId}.aac`

        setAudioSrc(audioPath)
        console.log('🎵 Setting audio source:', audioPath)
    }, [currentLocale, currentPaintingId, currentRoomId])

    // Simplified audio playback
    const playAudio = useCallback(async () => {
        if (!audioRef.current || !audioSrc) {
            console.warn('Cannot play audio: missing audio element or source')
            return
        }

        try {
            // Set playback speed
            audioRef.current.playbackRate = DEFAULT_PLAYBACK_SPEED
            
            await audioRef.current.play()
            setIsPlaying(true)
        } catch (error) {
            console.warn('Error playing audio:', error)
            setIsPlaying(false)
        }
    }, [audioSrc])

    // Use Next.js router for navigation instead of window.location
    const handleNavigation = (url: string | null) => {
        if (url) {
            // Pause audio before navigation
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
            setIsPlaying(false)

            // Use Next.js router
            router.push(url)
        }
    }

    // Effect for audio setup - simplified
    useEffect(() => {
        setAudioSource()

        // Update service worker with current position
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller && currentRoomId) {
            navigator.serviceWorker.controller.postMessage({
                type: 'UPDATE_POSITION',
                position: {
                    roomId: currentRoomId,
                    paintingId: currentPaintingId
                },
                locale: currentLocale
            })
        }

        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [pathname, setAudioSource, currentRoomId, currentPaintingId, currentLocale])

    // Cleanup on unmount
    useEffect(() => {
        const audioElement = audioRef.current
        const abortController = abortControllerRef.current
        
        return () => {
            if (abortController) {
                abortController.abort()
            }
            if (audioElement) {
                audioElement.pause()
                audioElement.currentTime = 0
            }
        }
    }, [])

    // Toggle audio playback
    const toggleAudio = () => {
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause()
                setIsPlaying(false)
            }
        } else {
            playAudio()
        }
    }

    // Progress bar interaction - simplified with proper cleanup
    const [isDragging, setIsDragging] = useState(false)

    const handleProgressBarInteraction = (event: React.MouseEvent | React.TouchEvent) => {
        if (!audioRef.current) return

        const progressBar = event.currentTarget
        const rect = progressBar.getBoundingClientRect()

        const clientX = 'touches' in event
            ? event.touches[0].clientX
            : event.clientX

        const position = (clientX - rect.left) / rect.width
        const newTime = position * audioRef.current.duration

        audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration))
        setProgress(position * 100)
    }

    // Progress bar dragging with proper cleanup
    useEffect(() => {
        if (!isDragging) return

        const handleMove = (event: MouseEvent | TouchEvent) => {
            if (!audioRef.current) return

            const progressBar = document.querySelector('.progress-bar')
            if (!progressBar) return

            const rect = progressBar.getBoundingClientRect()
            const clientX = 'touches' in event
                ? event.touches[0].clientX
                : event.clientX

            const position = (clientX - rect.left) / rect.width
            const newTime = position * audioRef.current.duration

            audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration))
            setProgress(Math.max(0, Math.min(position * 100, 100)))
        }

        const handleEnd = () => setIsDragging(false)

        // Add event listeners
        document.addEventListener('mousemove', handleMove, { passive: true })
        document.addEventListener('touchmove', handleMove, { passive: true })
        document.addEventListener('mouseup', handleEnd, { passive: true })
        document.addEventListener('touchend', handleEnd, { passive: true })

        // Cleanup function
        return () => {
            document.removeEventListener('mousemove', handleMove)
            document.removeEventListener('touchmove', handleMove)
            document.removeEventListener('mouseup', handleEnd)
            document.removeEventListener('touchend', handleEnd)
        }
    }, [isDragging])

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-20">
                <div className="max-w-full w-screen pt-2 pb-1 bg-background/10 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75">
                    <div
                        ref={roomsContainerRef}
                        className="overflow-x-auto"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            maxWidth: '100vw'
                        }}
                    >
                        <div className="flex flex-nowrap">
                            {rooms.map((room, index) => (
                                <Button
                                    key={room.roomTitle}
                                    data-room-active={room.id === currentRoomId}
                                    data-room-id={room.id}
                                    data-room-number={room.roomNumber}
                                    className={cn("rounded-none whitespace-nowrap flex-none mr-1 first:ml-2 h-12 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75",
                                        room.id === currentRoomId ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground active:bg-secondary/60 active:text-secondary-foreground" : "bg-background/60 dark:bg-background/60 hover:bg-background/80")}
                                    asChild
                                >
                                    <a 
                                        href={`/van-gogh/${locale}/${room.id}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleNavigation(`/van-gogh/${locale}/${room.id}`)
                                        }}
                                    >
                                        {index === rooms.length - 1 ? getTranslation(locale, "end") : `${room.roomNumber}: ${room.roomTitle}`}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-full p-0 pb-2 bg-background/10 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75">
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
                                            room.id === currentRoomId
                                                ? "shadow-[inset_0_-4px_0_0_hsl(var(--secondary))]"
                                                : "bg-background/60 dark:bg-background/60 hover:bg-background/80")}
                                                
                                        asChild
                                    >
                                        <a 
                                            href={`/van-gogh/${currentLocale}/${room.id}/${painting.id}`}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleNavigation(`/van-gogh/${currentLocale}/${room.id}/${painting.id}`)
                                            }}
                                        >
                                            {painting.paintingNumber}
                                        </a>
                                    </Button>
                                )) : []),
                                roomIndex < rooms.length - 1 && rooms[roomIndex + 1].paintings.length ? (
                                    <div
                                        key={`separator-${room.roomTitle}`}
                                        className="h-12 w-[4px] bg-neutral-300 dark:bg-neutral-800 mr-1 rounded-full separator "
                                    >&nbsp;</div>
                                ) : null,
                            ])}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 bg-transparent justify-end p-2">
                    <ChronologyDrawer currentLocale={currentLocale} />
                    <ExhibitionMapDrawer currentLocale={currentLocale} />
                    <LanguageDrawer currentLocale={currentLocale}/>
                </div>
            </nav>

            <main>
                {children}
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-10">
                <div className="flex justify-stretch gap-2 bg-transparent">
                    <BottomNaButton
                        className="rounded-tr-xl"
                        onClick={() => handleNavigation(getPreviousUrl())}
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
                        setIsDragging(true)
                        handleProgressBarInteraction(e)
                    }}
                    onMouseDown={(e) => {
                        setIsDragging(true)
                        handleProgressBarInteraction(e)
                    }}
                >
                    <div
                        className="h-full bg-blue-500 transition-all duration-100 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Simplified audio element with proper error handling */}
            <audio
                ref={audioRef}
                src={audioSrc || undefined}
                preload="auto"
                style={{ display: 'none' }}
                onError={(e) => {
                    console.warn('Audio Error:', e.currentTarget.error?.message)
                    setIsPlaying(false)
                }}
                onLoadedData={() => {
                    if (audioRef.current) {
                        audioRef.current.playbackRate = DEFAULT_PLAYBACK_SPEED
                    }
                }}
                onTimeUpdate={() => {
                    if (audioRef.current) {
                        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
                    }
                }}
                onEnded={() => {
                    setIsPlaying(false)
                    setProgress(0)
                }}
            />
        </>
    )
}

const BottomNaButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    function BottomNaButton({ className, variant, size, asChild = false, disabled, ...props }, ref) {
        return (
            <Button
                className={cn(
                    buttonVariants({ variant, size, className }), 
                    "h-12 flex-1 flex items-center justify-center ring-1 ring-foreground/5 backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-75",
                    disabled 
                        ? "bg-background/20 text-foreground/30 hover:bg-background/20 cursor-not-allowed" 
                        : "bg-background text-foreground hover:bg-background/80",
                    className
                )}
                ref={ref}
                disabled={disabled}
                {...props}
                style={{
                    opacity: 1, // hard overwrite shadcn button 0.5 opacity for disabled state, but keep it passed for a11y
                }}
                asChild={asChild}
            />
        )
    }
)