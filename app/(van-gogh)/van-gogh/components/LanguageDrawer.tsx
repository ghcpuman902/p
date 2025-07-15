'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
import { Button } from "@/components/ui/button"
import { SUPPORTED_LOCALES, Locale, getTranslation } from '../libs/localization'
import { cn } from '@/lib/utils'

interface LanguageDrawerProps {
    currentLocale: Locale
}

interface ServiceWorkerResponse {
    success: boolean;
    message: string;
    error?: string;
}

export function LanguageDrawer({ currentLocale }: LanguageDrawerProps) {
    const [status, setStatus] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null)

    const isServiceWorkerSupported = () => {
        if (typeof window === 'undefined') return false;
        return 'serviceWorker' in navigator;
    }

    const handleLanguageChange = (locale: Locale) => {
        // Use hard navigation to trigger automatic service worker caching
        const newPath = window.location.pathname.replace(
            /\/van-gogh\/[^/]+/,
            `/van-gogh/${locale}`
        )
        // Use window.location.href for hard navigation to ensure service worker intercepts
        window.location.href = newPath
    }

    const handlePurgeCache = async () => {
        setStatus({ message: 'Purging cache...', type: 'info' });
        
        if (!isServiceWorkerSupported()) {
            setStatus({ message: 'Service Worker not supported', type: 'error' });
            return;
        }

        if (!navigator.serviceWorker.controller) {
            setStatus({ message: 'Service Worker not ready. Please refresh the page.', type: 'error' });
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const messageChannel = new MessageChannel();
            
            const response = await new Promise<ServiceWorkerResponse>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Service Worker response timeout')), 10000);
                
                messageChannel.port1.onmessage = (event) => {
                    clearTimeout(timeout);
                    resolve(event.data);
                };
                
                registration.active?.postMessage(
                    { type: 'PURGE_CACHE' },
                    [messageChannel.port2]
                );
            });

            setStatus({ 
                message: response.message, 
                type: response.success ? 'success' : 'error' 
            });
        } catch (err) {
            setStatus({ 
                message: err instanceof Error ? err.message : 'Failed to purge cache', 
                type: 'error' 
            });
        }
    }

    return (
        <SharedDrawer
            title={""}
            pageTitle={getTranslation(currentLocale, "changeLanguage")}
            icon={Flag}
            description={getTranslation(currentLocale, "selectLanguage")}
        >
            <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {SUPPORTED_LOCALES.map((locale) => (
                        <Button
                            key={locale}
                            variant={locale === currentLocale ? "secondary" : "outline"}
                            className="w-full rounded-full"
                            onClick={() => handleLanguageChange(locale)}
                        >
                            {getTranslation(locale, "languageName")}
                        </Button>
                    ))}
                </div>

                <div className="space-y-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={handlePurgeCache}
                    >
                        {getTranslation(currentLocale, "purgeCache")}
                    </Button>

                    {status && (
                        <p className={cn(
                            "text-center text-sm",
                            status.type === 'error' && "text-red-500",
                            status.type === 'success' && "text-green-500",
                            status.type === 'info' && "text-blue-500"
                        )}>
                            {status.message}
                        </p>
                    )}

                    <div className="text-center text-xs text-gray-500">
                        Service Worker Status: {
                            typeof window !== 'undefined' && navigator?.serviceWorker?.controller 
                                ? 'Active' 
                                : 'Not Active'
                        }
                    </div>
                </div>
            </div>
        </SharedDrawer>
    )
} 