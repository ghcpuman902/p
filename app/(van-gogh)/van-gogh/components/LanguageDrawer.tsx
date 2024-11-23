'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
import { Button } from "@/components/ui/button"
import { SUPPORTED_LOCALES, Locale, getTranslation } from '../libs/localization'
import { useRouter } from 'next/navigation'

interface LanguageDrawerProps {
    currentLocale: Locale
}

export function LanguageDrawer({ currentLocale }: LanguageDrawerProps) {
    const router = useRouter()
    const [randomNumber, setRandomNumber] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    const isServiceWorkerSupported = () => {
        if (typeof window === 'undefined') return false;
        return 'serviceWorker' in navigator;
    }

    const handleLanguageChange = (locale: Locale) => {
        const newPath = window.location.pathname.replace(
            /\/van-gogh\/[^/]+/,
            `/van-gogh/${locale}`
        )
        router.push(newPath)
    }

    const handleGetRandomNumber = async () => {
        setError(null) // Reset error state
        
        if (!isServiceWorkerSupported()) {
            console.log('Service Worker not supported');
            setError('Service Worker not supported');
            return;
        }

        if (!navigator.serviceWorker.controller) {
            console.log('Service Worker not controlling the page');
            setError('Service Worker not ready. Please refresh the page.');
            return;
        }

        try {
            // Create a message channel
            const messageChannel = new MessageChannel();
            
            // Create a promise that will reject if we don't get a response within 3 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Service Worker response timeout')), 3000);
            });

            const messagePromise = new Promise((resolve) => {
                messageChannel.port1.onmessage = (event) => {
                    console.log('Received response:', event.data);
                    resolve(event.data);
                };
            });

            console.log('Sending message to Service Worker...');
            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_RANDOM_NUMBER' },
                [messageChannel.port2]
            );

            // Wait for either the response or timeout
            const response = await Promise.race([messagePromise, timeoutPromise]);
            if (response && typeof response === 'object' && 'randomNumber' in response) {
                setRandomNumber(response.randomNumber as number);
            } else {
                setError('Unexpected response format from Service Worker');
            }
            
        } catch (err) {
            console.error('Error communicating with Service Worker:', err);
            setError(err instanceof Error ? err.message : 'Failed to get random number');
        }
    }

    return (
        <SharedDrawer
            title={""}
            icon={Flag}
            description={getTranslation(currentLocale, "selectLanguage")}
        >
            <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SUPPORTED_LOCALES.map((locale) => (
                        <div key={locale}>
                            <Button
                                variant={locale === currentLocale ? "secondary" : "outline"}
                                className="w-full"
                                onClick={() => handleLanguageChange(locale)}
                            >
                                {getTranslation(locale, "languageName")}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGetRandomNumber}
                    >
                        {getTranslation(currentLocale, "getRandomNumber")}
                    </Button>
                    
                    {randomNumber !== null && (
                        <p className="text-center text-sm">
                            {getTranslation(currentLocale, "randomNumber")}: {randomNumber}
                        </p>
                    )}

                    {error && (
                        <p className="text-center text-sm text-red-500">
                            {error}
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