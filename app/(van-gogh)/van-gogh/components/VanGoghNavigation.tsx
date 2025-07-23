'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { usePathname, useSelectedLayoutSegments, useRouter } from 'next/navigation'
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { type Room, type Painting } from '../libs/types'
import { cn } from '@/lib/utils'
import { ExhibitionMapDrawer } from './ExhibitionMapDrawer'
import { ChronologyDrawer } from './ChronologyDrawer'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, Locale, getTranslation } from '../libs/localization'
import { LanguageDrawer } from './LanguageDrawer'
import PaintingDetails from './PaintingDetails'

interface VanGoghNavigationProps {
    roomOptions: {
        [K in Locale]: Room[]
    }
    children: React.ReactNode
}

// Add this constant near the top of the file
const DEFAULT_PLAYBACK_SPEED = 1.1

// Add this interface for raw room data from service worker
interface RawRoom {
    roomTitle: string;
    roomNumber: number;
    roomIntroduction: string;
    roomImage: {
        url: string;
        description: string;
    };
    paintings: Array<{
        paintingNumber: string;
        paintingTitle: string;
        paintingTime: string;
        media: string;
        origin: string;
        exhibitionText: string;
        image: {
            url: string;
            description: string;
        } | null;
    }>;
}

interface ServiceWorkerResponse {
    success: boolean;
    roomData?: {
        rooms: RawRoom[];
    };
}

export function VanGoghNavigation({ roomOptions, children }: VanGoghNavigationProps) {
    const pathname = usePathname()
    const segments = useSelectedLayoutSegments()
    const router = useRouter()

    // Add offline detection and client-side navigation state
    const [isOffline, setIsOffline] = useState(() => {
        // Check initial offline state
        if (typeof window !== 'undefined') {
            return !navigator.onLine;
        }
        return false;
    })
    const [clientPathname, setClientPathname] = useState(pathname)

    // Add service worker room data state for offline use
    const [serviceWorkerRoomData, setServiceWorkerRoomData] = useState<{
        [K in Locale]: Room[]
    } | null>(null)

    // Function to process raw room data the same way getRooms.ts does
    const processRoomData = useCallback((rawRooms: RawRoom[]): Room[] => {
        return rawRooms.map((room: RawRoom, index: number) => {
            const roomNumber = index + 1
            return {
                ...room,
                id: `room-${roomNumber}`,
                roomNumber: roomNumber,
                paintings: room.paintings.map((painting) => ({
                    ...painting,
                    type: 'painting' as const,
                    id: `painting-${roomNumber}-${painting.paintingNumber}`,
                    roomNumber: roomNumber,
                }))
            }
        })
    }, [])

    // Use client pathname when offline, regular pathname when online
    const effectivePathname = isOffline ? clientPathname : pathname

    // Clean up segments to handle multiple locales - moved before parseUrlAndFindContent
    const getLocaleFromSegments = (segs: string[]): Locale => {
        const expandedSegs = segs.flatMap(seg => seg.split('/'))
        const localeSegments = expandedSegs
            .filter(seg => SUPPORTED_LOCALES.includes(seg as Locale))
        return localeSegments.length > 0
            ? localeSegments[localeSegments.length - 1] as Locale
            : DEFAULT_LOCALE
    }

    const locale = getLocaleFromSegments(segments)
    
    // Memoize room options to prevent infinite re-renders
    const availableRoomOptions = useMemo(() => {
        const result = isOffline && serviceWorkerRoomData ? serviceWorkerRoomData : roomOptions
        console.log(`🔍 ROOM-OPTIONS-DEBUG: isOffline=${isOffline}, serviceWorkerRoomData=${!!serviceWorkerRoomData}, using=${isOffline && serviceWorkerRoomData ? 'serviceWorker' : 'server'} data`);
        if (isOffline && serviceWorkerRoomData) {
            console.log(`🔍 ROOM-OPTIONS-DEBUG: Service worker room data for en-GB:`, serviceWorkerRoomData['en-GB']?.slice(0, 2).map(r => ({ id: r.id, title: r.roomTitle })));
        }
        return result
    }, [isOffline, serviceWorkerRoomData, roomOptions])
    
    const rooms = availableRoomOptions[locale]

    // Service worker room data fetching for offline mode
    const fetchRoomDataFromServiceWorker = useCallback(async (targetLocale: Locale) => {
        console.log(`🔍 SW-DATA: Fetching room data for ${targetLocale} from service worker`);
        
        if (!('serviceWorker' in navigator)) {
            console.warn('🔍 SW-DATA: Service worker not supported');
            return null;
        }

        try {
            // Use navigator.serviceWorker.ready instead of checking controller
            // The service worker can still be active even if controller is null when offline
            const registration = await navigator.serviceWorker.ready;
            
            if (!registration.active) {
                console.warn('🔍 SW-DATA: Service worker not active');
                return null;
            }
            
            console.log(`🔍 SW-DATA: Service worker is active, attempting communication...`);
            
            const messageChannel = new MessageChannel();
            
            const response = await new Promise<ServiceWorkerResponse>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    console.warn(`🔍 SW-DATA: Service worker response timeout for ${targetLocale}`);
                    reject(new Error('Service Worker response timeout'));
                }, 8000); // Increased timeout for offline scenarios
                
                messageChannel.port1.onmessage = (event) => {
                    clearTimeout(timeout);
                    console.log(`🔍 SW-DATA: Received response from service worker for ${targetLocale}:`, event.data);
                    resolve(event.data);
                };
                
                // Use registration.active instead of navigator.serviceWorker.controller
                // We already checked that registration.active is not null above
                if (registration.active) {
                    registration.active.postMessage(
                        { type: 'GET_CACHED_DATA', locale: targetLocale },
                        [messageChannel.port2]
                    );
                    
                    console.log(`🔍 SW-DATA: Message sent to service worker for ${targetLocale}`);
                } else {
                    clearTimeout(timeout);
                    reject(new Error('Service worker active instance not available'));
                }
            });

            if (response.success && response.roomData) {
                console.log(`🔍 SW-DATA: Successfully fetched room data for ${targetLocale}: ${response.roomData.rooms.length} rooms`);
                return response.roomData.rooms;
            } else {
                console.warn(`🔍 SW-DATA: Failed to fetch room data for ${targetLocale}:`, response);
                return null;
            }
        } catch (error) {
            console.warn(`🔍 SW-DATA: Error fetching room data for ${targetLocale}:`, error);
            
            // Additional fallback: try to get data directly from cache using Cache API
            try {
                console.log(`🔍 SW-DATA: Trying direct cache access for ${targetLocale}...`);
                const cache = await caches.open('van-gogh-data-v5');
                const response = await cache.match(`/van-gogh-assets/${targetLocale}_rooms.json`);
                
                if (response) {
                    const data = await response.json();
                    console.log(`🔍 SW-DATA: Successfully fetched room data from direct cache access for ${targetLocale}: ${data.rooms?.length || 0} rooms`);
                    return data.rooms || data;
                }
            } catch (cacheError) {
                console.warn(`🔍 SW-DATA: Direct cache access failed for ${targetLocale}:`, cacheError);
            }
            
            return null;
        }
    }, [])

    // Audio state management - simplified
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [audioSrc, setAudioSrc] = useState<string | null>(null)

    // Function to parse URL and find current room/painting when offline
    const parseUrlAndFindContent = useCallback((path: string) => {
        console.log(`🔍 OFFLINE-DEBUG: Parsing URL: "${path}"`);
        console.log(`🔍 OFFLINE-DEBUG: availableRoomOptions keys:`, Object.keys(availableRoomOptions));
        console.log(`🔍 OFFLINE-DEBUG: availableRoomOptions en-GB length:`, availableRoomOptions['en-GB']?.length);
        console.log(`🔍 OFFLINE-DEBUG: First room sample:`, availableRoomOptions['en-GB']?.[0] ? { id: availableRoomOptions['en-GB'][0].id, title: availableRoomOptions['en-GB'][0].roomTitle } : 'no rooms');
        
        const pathParts = path.split('van-gogh/')[1]?.split('/') || []
        console.log(`🔍 OFFLINE-DEBUG: Path parts:`, pathParts);
        
        // Clean up pathParts to handle multiple locales
        const cleanPathParts = (() => {
            const localeIndexes = pathParts
                .map((part, index) => SUPPORTED_LOCALES.includes(part as Locale) ? index : -1)
                .filter(index => index !== -1)

            if (localeIndexes.length > 1) {
                return pathParts.slice(localeIndexes[localeIndexes.length - 1])
            }
            return pathParts
        })()

        console.log(`🔍 OFFLINE-DEBUG: Clean path parts:`, cleanPathParts);

        let [currentLocale, currentRoomId, currentPaintingId] = cleanPathParts as [Locale, string, string]

        // Handle cases where locale is not in the URL
        if (!SUPPORTED_LOCALES.includes(currentLocale as Locale)) {
            console.log(`🔍 OFFLINE-DEBUG: Locale "${currentLocale}" not supported, adjusting...`);
            currentPaintingId = currentRoomId
            currentRoomId = currentLocale
            currentLocale = locale // Use the locale from segments
        }

        console.log(`🔍 OFFLINE-DEBUG: Parsed - locale: "${currentLocale}", roomId: "${currentRoomId}", paintingId: "${currentPaintingId}"`);

        // Use available room options (either from server or service worker)
        const rooms = availableRoomOptions[currentLocale] || availableRoomOptions[DEFAULT_LOCALE]
        console.log(`🔍 OFFLINE-DEBUG: Using rooms for locale "${currentLocale}", found ${rooms?.length || 0} rooms`);
        
        // Debug: Log all room IDs to see what we're working with
        if (rooms && rooms.length > 0) {
            console.log(`🔍 OFFLINE-DEBUG: Available room IDs:`, rooms.map((room: Room) => room.id));
        }

        if (!rooms || rooms.length === 0) {
            console.log(`🔍 OFFLINE-DEBUG: No rooms available for locale "${currentLocale}"`);
            return { 
                locale: currentLocale, 
                currentRoom: null, 
                currentPainting: null 
            }
        }

        // Handle painting number redirects
        if (currentRoomId?.startsWith('painting-')) {
            console.log(`🔍 OFFLINE-DEBUG: Detected direct painting access: "${currentRoomId}"`);
            const paintingNumber = currentRoomId.split('-')[1]
            const painting = rooms.flatMap((room: Room) => room.paintings)
                .find((painting: Painting) => painting.paintingNumber === paintingNumber)

            if (painting) {
                console.log(`🔍 OFFLINE-DEBUG: Found painting ${paintingNumber} in room ${painting.roomNumber}`);
                currentRoomId = `room-${painting.roomNumber}`
                currentPaintingId = painting.id
            } else {
                console.log(`🔍 OFFLINE-DEBUG: Painting ${paintingNumber} not found`);
            }
        }

        // Find current room
        console.log(`🔍 OFFLINE-DEBUG: Looking for room with ID: "${currentRoomId}"`);
        const currentRoom = rooms.find((room: Room) => room.id === currentRoomId)
        console.log(`🔍 OFFLINE-DEBUG: Found room:`, currentRoom ? `${currentRoom.id} (${currentRoom.roomTitle})` : 'null');
        
        if (!currentRoom) {
            console.log(`🔍 OFFLINE-DEBUG: No room found, returning fallback to first room`);
            return { 
                locale: currentLocale, 
                currentRoom: rooms[0] || null, 
                currentPainting: null 
            }
        }

        // Find current painting if specified
        let currentPainting: Painting | null = null
        if (currentPaintingId) {
            console.log(`🔍 OFFLINE-DEBUG: Looking for painting: "${currentPaintingId}"`);
            
            // Handle direct painting number access
            if (currentPaintingId.match(/^\d+$/)) {
                console.log(`🔍 OFFLINE-DEBUG: Direct painting number access: ${currentPaintingId}`);
                currentPainting = currentRoom.paintings.find(
                    (p: Painting) => p.paintingNumber === currentPaintingId
                ) || null
            } else {
                console.log(`🔍 OFFLINE-DEBUG: Looking for painting by ID: ${currentPaintingId}`);
                currentPainting = currentRoom.paintings.find(
                    (painting: Painting) => painting.id === currentPaintingId
                ) || null
            }
            
            console.log(`🔍 OFFLINE-DEBUG: Found painting:`, currentPainting ? `${currentPainting.id} (#${currentPainting.paintingNumber})` : 'null');
        }

        const result = {
            locale: currentLocale,
            currentRoom,
            currentPainting
        };
        
        console.log(`🔍 OFFLINE-DEBUG: Final result:`, {
            locale: result.locale,
            roomId: result.currentRoom?.id,
            roomTitle: result.currentRoom?.roomTitle,
            paintingId: result.currentPainting?.id,
            paintingNumber: result.currentPainting?.paintingNumber
        });
        
        return result;
    }, [availableRoomOptions, locale])

    // Effect to fetch service worker room data when going offline
    useEffect(() => {
        if (isOffline && !serviceWorkerRoomData) {
            console.log(`🔍 SW-DATA: Going offline, fetching room data from service worker`);
            
            // Fetch room data for all supported locales
            const fetchAllRoomData = async () => {
                const roomDataPromises = SUPPORTED_LOCALES.map(async (locale) => {
                    const rawRoomData = await fetchRoomDataFromServiceWorker(locale);
                    if (rawRoomData && Array.isArray(rawRoomData)) {
                        // Process raw room data to add IDs the same way getRooms.ts does
                        const processedRoomData = processRoomData(rawRoomData);
                        return [locale, processedRoomData];
                    }
                    return [locale, null];
                });
                
                const results = await Promise.all(roomDataPromises);
                const roomDataMap = Object.fromEntries(
                    results.filter(([, roomData]) => roomData !== null)
                ) as { [K in Locale]: Room[] };
                
                if (Object.keys(roomDataMap).length > 0) {
                    console.log(`🔍 SW-DATA: Processed and stored room data for locales:`, Object.keys(roomDataMap));
                    setServiceWorkerRoomData(roomDataMap);
                } else {
                    console.warn(`🔍 SW-DATA: No room data available from service worker`);
                }
            };
            
            fetchAllRoomData();
        }
    }, [isOffline, serviceWorkerRoomData, fetchRoomDataFromServiceWorker, processRoomData]);

    // Offline detection effect
    useEffect(() => {
        const updateOfflineStatus = () => {
            const offline = !navigator.onLine
            const wasOffline = isOffline
            
            setIsOffline(offline)
            console.log(`🌐 Navigation: ${offline ? 'Going OFFLINE' : 'Going ONLINE'} (was ${wasOffline ? 'offline' : 'online'})`)
            
            if (!wasOffline && offline) {
                // Just went offline - ensure clientPathname matches current pathname
                console.log(`🔄 Navigation: Going offline, setting clientPathname to current pathname: ${pathname}`)
                setClientPathname(pathname)
            } else if (wasOffline && !offline) {
                // Just went online
                console.log(`🔄 Navigation: Going online, clientPathname: ${clientPathname}, pathname: ${pathname}`)
            }
        }

        // Initial check
        updateOfflineStatus()

        // Listen for online/offline events
        window.addEventListener('online', updateOfflineStatus)
        window.addEventListener('offline', updateOfflineStatus)

        return () => {
            window.removeEventListener('online', updateOfflineStatus)
            window.removeEventListener('offline', updateOfflineStatus)
        }
    }, [pathname, isOffline, clientPathname])

    // Listen for popstate events to handle browser back/forward when offline
    useEffect(() => {
        if (!isOffline) return

        const handlePopState = () => {
            setClientPathname(window.location.pathname)
            console.log(`🔄 Navigation: Client pathname updated to ${window.location.pathname} (popstate)`)
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [isOffline])

    const roomsContainerRef = useRef<HTMLDivElement>(null)
    const paintingsContainerRef = useRef<HTMLDivElement>(null)

    // More defensive URL parsing - use effective pathname
    const pathParts = effectivePathname.split('van-gogh/')[1]?.split('/') || []

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

    // Memoize offline content to prevent infinite re-renders
    const offlineContent = useMemo(() => {
        return isOffline ? parseUrlAndFindContent(effectivePathname) : null
    }, [isOffline, parseUrlAndFindContent, effectivePathname])

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
        console.log(`🎵 AUDIO-DEBUG: setAudioSource called - isOffline: ${isOffline}, currentRoomId: "${currentRoomId}", currentPaintingId: "${currentPaintingId}", currentLocale: "${currentLocale}"`);
        
        // Cancel any ongoing operations
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        // Basic validation
        if (!currentRoomId && !currentPaintingId) {
            console.log('🎵 AUDIO-DEBUG: No room or painting ID, clearing audio source');
            setAudioSrc(null)
            setIsPlaying(false)
            return
        }

        // Set audio source - let service worker handle availability
        const audioPath = currentPaintingId
            ? `/van-gogh-assets/${currentLocale}.${currentPaintingId}.aac`
            : `/van-gogh-assets/${currentLocale}.${currentRoomId}.aac`

        console.log(`🎵 AUDIO-DEBUG: Setting audio source: "${audioPath}" (${isOffline ? 'OFFLINE' : 'ONLINE'} mode)`);
        setAudioSrc(audioPath)
        
        // When offline, also check if audio element loads the source
        if (isOffline && audioRef.current) {
            console.log(`🎵 AUDIO-DEBUG: Offline mode - checking audio element readiness`);
            const audio = audioRef.current;
            
            // Add one-time event listeners to debug loading
            const handleLoadStart = () => {
                console.log(`🎵 AUDIO-DEBUG: Audio load started for ${audioPath}`);
            };
            const handleCanPlay = () => {
                console.log(`🎵 AUDIO-DEBUG: Audio can play ${audioPath}`);
            };
            const handleError = (e: Event) => {
                console.log(`🎵 AUDIO-DEBUG: Audio error loading ${audioPath}:`, (e.target as HTMLAudioElement)?.error);
            };
            const handleLoadedData = () => {
                console.log(`🎵 AUDIO-DEBUG: Audio data loaded for ${audioPath}, duration: ${audio.duration}s`);
            };
            
            audio.addEventListener('loadstart', handleLoadStart, { once: true });
            audio.addEventListener('canplay', handleCanPlay, { once: true });
            audio.addEventListener('error', handleError, { once: true });
            audio.addEventListener('loadeddata', handleLoadedData, { once: true });
        }
    }, [currentLocale, currentPaintingId, currentRoomId, isOffline])

    // Simplified audio playback
    const playAudio = useCallback(async () => {
        console.log(`🎵 AUDIO-DEBUG: playAudio called - audioRef.current: ${!!audioRef.current}, audioSrc: "${audioSrc}", isOffline: ${isOffline}`);
        
        if (!audioRef.current || !audioSrc) {
            console.warn('🎵 AUDIO-DEBUG: Cannot play audio - missing audio element or source');
            return
        }

        const audio = audioRef.current;
        console.log(`🎵 AUDIO-DEBUG: Audio element state - readyState: ${audio.readyState}, duration: ${audio.duration}, src: "${audio.src}"`);

        try {
            // Set playback speed
            audio.playbackRate = DEFAULT_PLAYBACK_SPEED
            console.log(`🎵 AUDIO-DEBUG: Set playback speed to ${DEFAULT_PLAYBACK_SPEED}`);
            
            console.log(`🎵 AUDIO-DEBUG: Attempting to play audio...`);
            await audio.play()
            console.log(`🎵 AUDIO-DEBUG: Audio play successful`);
            setIsPlaying(true)
        } catch (error) {
            console.warn(`🎵 AUDIO-DEBUG: Error playing audio:`, error);
            setIsPlaying(false)
        }
    }, [audioSrc, isOffline])

    // Enhanced navigation handler with offline support
    const handleNavigation = (url: string | null) => {
        if (!url) return

        // Pause audio before navigation
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        setIsPlaying(false)

        if (isOffline) {
            // Client-side navigation when offline
            console.log(`🔄 Navigation: Client-side navigation to ${url} (offline mode)`)
            
            // Update URL without triggering network request
            window.history.pushState({}, '', url)
            
            // Update client pathname to trigger re-render
            setClientPathname(url)
            
            console.log(`✅ Navigation: URL updated to ${url}, component will re-render`)
        } else {
            // Use Next.js router when online
            console.log(`🌐 Navigation: Next.js navigation to ${url} (online mode)`)
            router.push(url)
        }
    }

    // Effect for audio setup - use effective pathname
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
    }, [effectivePathname, setAudioSource, currentRoomId, currentPaintingId, currentLocale])

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
                                    className={cn("rounded-none whitespace-nowrap flex-none mr-1 first:ml-2 h-12 dark:ring-2 dark:ring-inset dark:ring-foreground/10 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75",
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
                                                : "bg-background/60 dark:bg-background/60 hover:bg-background/80 dark:ring-2 dark:ring-inset dark:ring-foreground/10")}
                                                
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
                {isOffline && offlineContent?.currentRoom ? (
                    <PaintingDetails
                        key={`offline-${offlineContent.locale}-${offlineContent.currentRoom.id}-${offlineContent.currentPainting?.id || 'room'}`}
                        currentRoom={offlineContent.currentRoom}
                        currentPainting={offlineContent.currentPainting}
                        locale={offlineContent.locale}
                    />
                ) : (
                    children
                )}
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
                    "h-12 flex-1 flex items-center justify-center ring-1 ring-foreground/5 dark:ring-foreground/30 backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-75",
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