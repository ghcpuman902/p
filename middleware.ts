import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only run this middleware for /van-gogh routes
  if (!pathname.startsWith('/van-gogh')) {
    return NextResponse.next()
  }

  // Check if the pathname already includes a language
  if (pathname.match(/^\/van-gogh\/(en-GB|zh-TW)/)) {
    return NextResponse.next()
  }

  // Get the preferred language from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  let lang = 'en-GB'

  if (acceptLanguage && acceptLanguage.startsWith('zh')) {
    lang = 'zh-TW'
  }

  // Rewrite the URL to include the language
  const segments = pathname.split('/').filter(Boolean)
  segments.splice(1, 0, lang)
  const newPathname = '/' + segments.join('/')
  const newUrl = new URL(newPathname, request.url)
  return NextResponse.rewrite(newUrl)
}

export const config = {
  matcher: '/van-gogh/:path*',
}