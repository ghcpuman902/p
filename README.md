This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Technical Details: Offline-Aware Navigation Implementation

### Problem Solved
When the Van Gogh exhibition app was used offline, navigating between paintings (e.g., room-1 → painting-1 → painting-2) caused cache misses and redirects back to the room view. This happened because:

1. **Next.js Router Dependency**: The app relied on Next.js server-side routing even when offline
2. **Service Worker Limitations**: The service worker cached pages but couldn't generate new page combinations dynamically
3. **Cache Miss Redirects**: Missing painting pages in cache caused fallbacks to cached room pages

### Solution: Hybrid Online/Offline Navigation

Implemented a smart navigation system in `VanGoghNavigation.tsx` that:

**When Online**: Uses Next.js router for server-side rendering and caching
**When Offline**: Switches to pure client-side navigation with local content rendering

### Key Technical Components

#### 1. Offline Detection & State Management
```typescript
const [isOffline, setIsOffline] = useState(false)
const [clientPathname, setClientPathname] = useState(pathname)
const effectivePathname = isOffline ? clientPathname : pathname
```

#### 2. Smart Navigation Handler
```typescript
const handleNavigation = (url: string | null) => {
  if (isOffline) {
    // Client-side navigation - no server requests
    window.history.pushState({}, '', url)
    setClientPathname(url)
  } else {
    // Server-side navigation via Next.js
    router.push(url)
  }
}
```

#### 3. URL Parsing & Content Resolution
```typescript
const parseUrlAndFindContent = useCallback((path: string) => {
  // Parse any van-gogh URL format
  // Find matching room/painting from existing data
  // Return renderable content object
}, [roomOptions, locale])
```

#### 4. Conditional Content Rendering
```tsx
<main>
  {isOffline && offlineContent?.currentRoom ? (
    <PaintingDetails
      currentRoom={offlineContent.currentRoom}
      currentPainting={offlineContent.currentPainting}
      locale={offlineContent.locale}
    />
  ) : (
    children // Server-rendered content when online
  )}
</main>
```

### Key Learnings

1. **PWAs Need Hybrid Navigation**: Offline-first apps require different navigation strategies for online vs offline states

2. **Service Workers Handle Assets, Not Logic**: Service workers excel at caching static assets but shouldn't handle complex content generation

3. **Client-Side Data is Key**: Having all room/painting data available client-side enables seamless offline navigation

4. **URL State Management**: Managing URL state manually during offline navigation maintains user experience and browser history

5. **Progressive Enhancement**: The solution gracefully falls back to server-side rendering when online, maintaining all Next.js benefits

### Result
- ✅ Instant offline navigation between any room/painting combination
- ✅ No cache misses or unexpected redirects
- ✅ Maintains URL integrity and browser history
- ✅ Seamless online/offline transitions
- ✅ Preserves all existing functionality when online

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
