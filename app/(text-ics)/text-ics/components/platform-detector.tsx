import { headers } from 'next/headers'

type Platform = 'apple' | 'google' | 'microsoft' | 'unknown'

export async function detectPlatform(): Promise<Platform> {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  
  // Check for Apple devices
  if (
    /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(userAgent) && 
    !/Chrome|Chromium/.test(userAgent)
  ) {
    return 'apple'
  }
  
  // Check for Google Chrome
  if (/Chrome|Chromium/.test(userAgent) && !/Edg|Edge|MSIE|Trident/.test(userAgent)) {
    return 'google'
  }
  
  // Check for Microsoft browsers/devices
  if (/Edg|Edge|MSIE|Trident|Windows Phone|Windows NT/.test(userAgent)) {
    return 'microsoft'
  }
  
  // Default case
  return 'unknown'
}

export default async function PlatformDetector() {
  const platform = await detectPlatform()
  
  // This component doesn't render anything visible
  // It just provides platform information via a data attribute
  return (
    <div data-platform={platform} className="hidden" />
  )
} 