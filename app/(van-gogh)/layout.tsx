import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
// import { ModeToggle } from '@/components/mode-toggle'
import { getRooms } from './van-gogh/utils/getRooms'
import { VanGoghNavigation } from './van-gogh/components/VanGoghNavigation'
import { type Room } from './van-gogh/types'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Van Gogh Digital Guide',
  description: 'A digital guide to Van Gogh\'s gallery exhibition, offering multilingual support, in-depth artwork details, and AI-driven commentary.',
  creator: 'Mangle Kuo',
  authors: [
    {
      name: 'Mangle Kuo',
      url: 'https://github.com/ghcpuman902/',
    }
  ],
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const rooms: Room[] = await getRooms()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VanGoghNavigation rooms={rooms}>
            {children}
          </VanGoghNavigation>
        </ThemeProvider>
      </body>
    </html>
  )
}