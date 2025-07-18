import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { getRooms } from './van-gogh/libs/getRooms'
import { VanGoghNavigation } from './van-gogh/components/VanGoghNavigation'
import { SUPPORTED_LOCALES, type Locale } from '@/app/(van-gogh)/van-gogh/libs/localization'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

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
  const roomsByLocale = await Promise.all(
    SUPPORTED_LOCALES.map(locale => getRooms(locale))
  );

  const roomOptions = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale, index) => [locale, roomsByLocale[index]])
  ) as Record<Locale, Awaited<ReturnType<typeof getRooms>>>;

  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('✅ SW: Data-first Service Worker registered successfully:', registration.scope);
                    
                    // Listen for service worker messages
                    navigator.serviceWorker.addEventListener('message', function(event) {
                      console.log('📨 SW: Received message from service worker:', event.data);
                      
                      if (event.data.type === 'ASSET_CACHE_COMPLETE') {
                        console.log('🎉 SW: Asset caching completed for', event.data.locale);
                        window.dispatchEvent(new CustomEvent('sw-asset-cache-complete', {
                          detail: event.data
                        }));
                      } else if (event.data.type === 'DOWNLOAD_PROGRESS') {
                        // You can dispatch custom events here for UI updates
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
              });
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

