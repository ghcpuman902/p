'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
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

    const handlePurgeCache = async () => {
        // Only allow cache purging in development
        if (process.env.NODE_ENV !== 'development') {
            console.warn('Cache purging is only available in development mode');
            return;
        }

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
                    {SUPPORTED_LOCALES.map((locale) => {
                        const newPath = `/van-gogh/${locale}/room-1`
                        
                        return (
                            <a
                                key={locale}
                                href={newPath}
                                className={cn(
                                    "w-full rounded-full px-4 py-2 text-center text-sm font-medium transition-colors",
                                    locale === currentLocale 
                                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                                        : "bg-background border border-input hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                {getTranslation(locale, "languageName")}
                            </a>
                        )
                    })}
                </div>

                <div className="space-y-2">
                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <button
                                type="button"
                                className="w-full rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 text-sm font-medium transition-colors"
                                onClick={handlePurgeCache}
                            >
                                {getTranslation(currentLocale, "purgeCache")}
                            </button>

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
                        </>
                    )}
                </div>
            </div>
        </SharedDrawer>
    )
} 