import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only run this middleware for /van-gogh routes
  if (!pathname.startsWith('/van-gogh')) {
    return NextResponse.next()
  }

  // Check if the pathname already includes a language
  if (pathname.match(/^\/van-gogh\/(en-GB|zh-TW|zh-CN)/)) {
    return NextResponse.next()
  }

  // Get the preferred language from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  let lang = 'en-GB'

  if (acceptLanguage && acceptLanguage.startsWith('zh')) {
    // Check for specific Chinese variants
    if (acceptLanguage.includes('zh-CN') || acceptLanguage.includes('zh-Hans')) {
      lang = 'zh-CN'
    } else {
      lang = 'zh-TW'
    }
  }

  // Redirect to the locale path - the page component will handle redirecting to the first room
  const newPathname = `/van-gogh/${lang}`
  const newUrl = new URL(newPathname, request.url)
  
  // Preserve query parameters
  newUrl.search = request.nextUrl.search
  
  const response = NextResponse.redirect(newUrl, 302)
  
  // Add cache control headers to prevent redirect caching
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  return response
}

export const config = {
  matcher: '/van-gogh/:path*',
}