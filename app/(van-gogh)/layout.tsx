import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { getLocaleAssets } from './van-gogh/libs/getRooms'
import { VanGoghNavigation } from './van-gogh/components/VanGoghNavigation'
import { SUPPORTED_LOCALES, type Locale } from '@/app/(van-gogh)/van-gogh/libs/localization'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial']
})

const APP_NAME = "Van Gogh Digital Guide";
const APP_DEFAULT_TITLE = "Van Gogh Digital Guide";
const APP_TITLE_TEMPLATE = "%s - Van Gogh Digital Guide";
const APP_DESCRIPTION = "A digital guide to Van Gogh's gallery exhibition, offering multilingual support, in-depth artwork details, and AI-driven commentary.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  creator: 'Mangle Kuo',
  authors: [
    {
      name: 'Mangle Kuo',
      url: 'https://github.com/ghcpuman902/',
    }
  ],
  manifest: '/van-gogh-assets/manifest.json',
  icons: {
    icon: [
      { url: '/van-gogh-assets/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/van-gogh-assets/favicon.svg', type: 'image/svg+xml' },
      { url: '/van-gogh-assets/favicon.ico' }
    ],
    apple: [
      { url: '/van-gogh-assets/apple-touch-icon.png', sizes: '180x180' }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--secondary))'},
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--secondary-invert))' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function VanGoghLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const localeAssets = await Promise.all(
    SUPPORTED_LOCALES.map(locale => getLocaleAssets(locale))
  );

  const roomOptions = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale, index) => [locale, localeAssets[index].rooms])
  ) as Record<Locale, Awaited<ReturnType<typeof getLocaleAssets>>['rooms']>;
  
  return (
    <html suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            // Service worker registration - now independent of layout data
            console.log('🔧 SW-REG: Starting independent service worker registration...');
            
            // Add global debug function for manual testing
            window.debugSW = function() {
              console.log('🔧 DEBUG: Manual SW registration test');
              console.log('Service Worker support:', 'serviceWorker' in navigator);
              console.log('Navigator online:', navigator.onLine);
              console.log('Current controller:', navigator.serviceWorker?.controller);
              
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  console.log('Existing registrations:', registrations.length);
                  registrations.forEach((reg, i) => {
                    console.log('Registration', i, ':', {
                      scope: reg.scope,
                      active: !!reg.active,
                      installing: !!reg.installing,
                      waiting: !!reg.waiting
                    });
                  });
                });
                
                fetch('/sw.js').then(r => {
                  console.log('SW file fetch status:', r.status, r.statusText);
                }).catch(e => {
                  console.error('SW file fetch error:', e);
                });
              }
            };
            
            if ('serviceWorker' in navigator) {
              console.log('✅ SW-REG: Service Worker supported');
              
              // Track if registration has been attempted
              let registrationAttempted = false;
              
              // Function to register service worker
              function registerServiceWorker() {
                if (registrationAttempted) {
                  console.log('🔧 SW-REG: Registration already attempted, skipping...');
                  return;
                }
                
                registrationAttempted = true;
                console.log('🔧 SW-REG: Starting service worker registration...');
                
                try {
                  navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                      console.log('✅ SW: Independent Service Worker registered successfully:', registration.scope);
                    console.log('🔧 SW-REG: Registration details:', {
                      scope: registration.scope,
                      active: !!registration.active,
                      activeState: registration.active?.state,
                      installing: !!registration.installing,
                      installingState: registration.installing?.state,
                      waiting: !!registration.waiting,
                      waitingState: registration.waiting?.state,
                      updateViaCache: registration.updateViaCache
                    });
                    
                      console.log('📋 SW: Service worker will fetch room data independently from JSON endpoints');
                    
                    // Listen for service worker messages
                    navigator.serviceWorker.addEventListener('message', function(event) {
                      console.log('📨 SW: Received message from service worker:', event.data.type);
                        if (event.data.type === 'SW_READY') {
                          console.log('🎉 SW: Service worker is ready:', event.data.message);
                          window.dispatchEvent(new CustomEvent('sw-ready', {
                          detail: event.data
                        }));
                      } else if (event.data.type === 'ASSET_CACHE_COMPLETE') {
                        console.log('🎉 SW: Asset caching completed for', event.data.locale);
                        window.dispatchEvent(new CustomEvent('sw-asset-cache-complete', {
                          detail: event.data
                        }));
                      } else if (event.data.type === 'DOWNLOAD_PROGRESS') {
                        window.dispatchEvent(new CustomEvent('sw-download-progress', {
                          detail: event.data
                        }));
                      } else if (event.data.type === 'DOWNLOAD_COMPLETE') {
                        console.log('🎉 SW: Download completed for', event.data.locale);
                        window.dispatchEvent(new CustomEvent('sw-download-complete', {
                          detail: event.data
                        }));
                      } else if (event.data.type === 'DOWNLOAD_ERROR') {
                        console.error('❌ SW: Download error for', event.data.locale, ':', event.data.error);
                        window.dispatchEvent(new CustomEvent('sw-download-error', {
                          detail: event.data
                        }));
                      }
                    });
                  })
                  .catch(function(error) {
                    console.error('❌ SW: Service Worker registration failed:', error);
                  });
                } catch (error) {
                  console.error('❌ SW-REG: Critical error in registration process:', error);
                }
              }
              
              // Register service worker immediately
              registerServiceWorker();
              
              // Also register on load event as backup
              if (document.readyState !== 'complete') {
                window.addEventListener('load', function() {
                  if (!navigator.serviceWorker.controller) {
                    registerServiceWorker();
                  }
                });
              }
            } else {
              console.warn('⚠️ SW: Service Worker not supported in this browser');
            }
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VanGoghNavigation roomOptions={roomOptions}>
            {children}
          </VanGoghNavigation>
        </ThemeProvider>
      </body>
    </html>
  )
}

