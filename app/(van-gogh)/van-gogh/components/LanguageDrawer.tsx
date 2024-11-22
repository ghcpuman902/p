'use client'

import { useState, useEffect } from 'react'
import { Flag } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SUPPORTED_LOCALES, Locale, getTranslation } from '../libs/localization'
import { prefetchAssets, getCacheStatus } from '../libs/prefetchAssets'
import { type Room } from '../libs/types'
import { useRouter } from 'next/navigation'

interface LanguageDrawerProps {
    currentLocale: Locale
    rooms: Room[]
}

export function LanguageDrawer({ currentLocale, rooms }: LanguageDrawerProps) {
    const router = useRouter()
    const [downloadProgress, setDownloadProgress] = useState<{
        cachedAssets: number
        totalAssets: number
        status: 'idle' | 'downloading' | 'complete' | 'error'
    }>({
        cachedAssets: 0,
        totalAssets: 0,
        status: 'idle'
    })

    // Check cache status when drawer opens
    useEffect(() => {
        getCacheStatus(currentLocale).then(status => {
            const totalAssets = rooms.reduce((acc, room) => {
                // Count: room audio + room image (if exists) + (painting audio + painting image) per painting
                return acc + 1 + (room.roomImage ? 1 : 0) + room.paintings.reduce((acc, painting) => {
                    return acc + 1 + (painting.image ? 1 : 0)
                }, 0)
            }, 0)
            
            setDownloadProgress(prev => ({
                ...prev,
                cachedAssets: status.cachedAssets,
                totalAssets
            }))
        })
    }, [currentLocale, rooms])

    const handleDownloadAssets = async (locale: Locale) => {
        setDownloadProgress(prev => ({ ...prev, status: 'downloading' }))
        
        try {
            const results = await prefetchAssets(locale, rooms)
            const successCount = results.filter(r => 
                r.status === 'cached' || r.status === 'already-cached'
            ).length
            
            setDownloadProgress(prev => ({
                ...prev,
                cachedAssets: successCount,
                status: 'complete'
            }))
        } catch (error) {
            console.error('Download failed:', error)
            setDownloadProgress(prev => ({ ...prev, status: 'error' }))
        }
    }

    const handleLanguageChange = (locale: Locale) => {
        // Update URL to new locale
        const newPath = window.location.pathname.replace(
            /\/van-gogh\/[^/]+/,
            `/van-gogh/${locale}`
        )
        router.push(newPath)
    }

    return (
        <SharedDrawer
            title={getTranslation(currentLocale, "language")}
            icon={Flag}
            description={getTranslation(currentLocale, "downloadDescription")}
        >
            <div className="p-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {SUPPORTED_LOCALES.map((locale) => (
                        <div key={locale} className="space-y-2">
                            <Button
                                variant={locale === currentLocale ? "secondary" : "outline"}
                                className="w-full"
                                onClick={() => handleLanguageChange(locale)}
                            >
                                {getTranslation(locale, "languageName")}
                            </Button>

                            {locale === currentLocale && (
                                <div className="space-y-2">
                                    <Progress 
                                        value={downloadProgress.totalAssets 
                                            ? (downloadProgress.cachedAssets / downloadProgress.totalAssets) * 100 
                                            : 0
                                        } 
                                    />
                                    
                                    <p className="text-sm text-muted-foreground text-center">
                                        {downloadProgress.cachedAssets} / {downloadProgress.totalAssets} {getTranslation(currentLocale, "filesDownloaded")}
                                    </p>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleDownloadAssets(locale)}
                                        disabled={downloadProgress.status === 'downloading'}
                                    >
                                        {downloadProgress.status === 'downloading' 
                                            ? getTranslation(currentLocale, "downloading")
                                            : getTranslation(currentLocale, "startDownload")
                                        }
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-sm text-muted-foreground">
                    {getTranslation(currentLocale, "downloadDescription")}
                </p>
            </div>
        </SharedDrawer>
    )
} 