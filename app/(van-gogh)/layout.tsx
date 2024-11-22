import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { getRooms } from './van-gogh/libs/getRooms'
import { VanGoghNavigation } from './van-gogh/components/VanGoghNavigation'
import { SUPPORTED_LOCALES, type Locale } from '@/app/(van-gogh)/van-gogh/libs/localization'

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
    { media: '(prefers-color-scheme: light)', color: 'rgba(244,244,245,0.8)'},
    { media: '(prefers-color-scheme: dark)', color: 'rgba(0,0,0,0.8)' }
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

