## Van Gogh Exhibition Web App

A mobile-first, offline-capable, multilingual web app designed to enhance exhibition access for non-English speakers. Built with Next.js and a custom service worker architecture, the project delivers a seamless, language-aware experience optimised for both human and machine users.

**DEMO:** [https://p.manglekuo.com/van-gogh](https://p.manglekuo.com/van-gogh)

This project started with a simple, personal problem: the exhibition booklet was only in English. There was no on-wall text, no translation, and no accessible audio for non-English speakers. Wanting to share the exhibition experience with family who don’t read English, I began by scanning the printed leaflet. That single gesture turned into a larger exploration of how web technologies can fill the gap between cultural content and multilingual accessibility.

The initial idea was modest: scan, OCR, translate, and read aloud. But each step added complexity, and each challenge taught me something about how the modern web behaves under constraints. Over time, this became a testbed for exploring how to:

- provide a robust offline-ready experience
- use AI to generate synchronised audio
- support multilingual users
- find the balance between client and server

I eventually achieved:

### Exhibition-Like Navigation
- Rooms are structured as real-world exhibition sections
- Paintings are grouped by room with consistent layout
- Native horizontal scroll mimics gallery flow

### Offline-First Architecture
- Once visited online, all content becomes fully available offline
- Includes pages, images, text, and audio
- Resilient even with JS disabled

### Multi-Language Support
- Simple hard navigation triggers locale switches
- No language preload or toggles required
- New locale assets are cached silently in the background

## Technical Highlights

### Static Rendering via Next.js
- Uses Incremental Static Regeneration (ISR)
- Pages are stable and accessible even with JavaScript disabled

### Custom Service Worker
- We initially considered `next-pwa`, but found it too heavy for our needs
- Wrote a service worker from scratch for full control
- Intercepts navigation, caches assets contextually

### Asset-Aware Caching Strategy
- Current room assets are prioritised
- Adjacent rooms are cached next
- Remaining content loads progressively in background

### Lean Asset Delivery
- Static image imports ensure known dimensions at build time
- SVG-based map keeps rendering light and precise
- MP3s compressed post-synthesis using ffmpeg
- Image optimization using imagemagick


## What We Learned (In Practice)

> Offline support is a browser-side concern

I went in thinking offline capability was just a PWA toggle. Turns out, it is much deeper. Next.js gives great SSR and static rendering, but does not aim to make content offline. That part lives entirely in the browser and the service worker.

> Progressive web app is not by default a offline-first app

I tried using [serwist](https://serwist.pages.dev/), a toolkit for building PWA with Next.js. I soon realised that for apps like mine, where content structure is fixed and no input is required, writing my own service worker was simpler and gave me full control over cache logic.

> Caching boundaries needs to be carefully considered

The app caches all assets of current locale aggressively as soon as user load a page. Switching language uses a full reload on purpose, so the service worker can detect the change and cache the new language silently. I find this the right balance between over-caching and under-caching.

> A good audio expereince goes beyond screen reader

I found that elements like images, links, names, and locations often require special handling when converting to audio, for example, the audio should read "please look at the screen" when there's an image. Since human voice audio does not require high quality, and can be compressed using ffmpeg to a small size, we tested and eventually used **32kbps at 16kHz** - achieving a **55% file size reduction** (from 70MB to 32MB) while maintaining indistinguishable audio quality. The OpenAI's Whisper offers advantages over a screen reader API due to multi linguo support, more natural flow, and more accurate pronunciation. I then adjusted the input text and used JavaScript to control the playback speed until I was satisfied with the natural flow.
 
> Don't Cache Pages — Cache Content

At first, I thought about caching React components or full pages. Eventually I realised the real value was in caching the data: the images, text, and audio. Everything else could be rebuilt quickly by the browser.
