# Van Gogh Exhibition Web App

This project is a digital adaptation of a Van Gogh exhibition booklet, originally available only in English. It leverages Next.js to deliver a smooth, multi-language browsing experience, highlighting modern web development practices like static generation, prefetching, and responsive design.

## Project Overview

The web app serves as a virtual companion to the Van Gogh exhibition, offering an organised, multi-room structure that aligns with the exhibition layout. Each room contains an introduction and multiple paintings, giving users an intuitive way to explore the artwork.

### Key Objectives

- **Multi-language Support**: Extend the exhibition's accessibility by providing information in additional languages.
- **Responsive & Snappy Navigation**: Optimise for fast loading and seamless transitions between rooms and paintings.

## Technical Highlights

1. **Incremental Static Regeneration (ISR)**:
   - Each room and painting page is pre-generated at build time, ensuring fast initial loads and stable URLs.
   - Links function reliably even when JavaScript is disabled, allowing graceful degradation with server-rendered content.

2. **Dynamic URL Mapping & Prefetching**:
   - The structure of the exhibition is mapped to RESTful URLs (`/room/[room-number]/painting/[painting-number]`), providing a clear and predictable routing schema.
   - Next.js `Link` components enable prefetching, making navigation feel instant.

3. **Static Image Imports**:
   - Images are imported statically, allowing Next.js to infer dimensions automatically during the build process, which enhances load times without requiring explicit image sizing.

4. **Custom SVG Exhibition Map**:
   - A minimalistic SVG map was designed to provide users with a quick visual guide of the exhibition layout.
   - Lightweight and efficient, the SVG is rendered in stock mode with pure black lines, minimising load on client devices.

5. **Optimised for Non-JavaScript Environments**:
   - With JavaScript disabled, the app falls back to server-rendered pages, maintaining essential functionality.
   - This approach ensures accessibility across diverse browsing environments, including low-bandwidth or limited-JS devices.

6. **Smooth Horizontal Scrolling for Room Navigation**:
   - Room and painting selection is enhanced with a horizontal scroll mechanism, giving a fluid browsing experience and reflecting the physical layout of the exhibition.

## Why This Project is a Strong Demonstration of Next.js

This app exemplifies core Next.js features in a real-world context:
- **Static Generation**: Demonstrates the power of pre-generated content and efficient data fetching.
- **Prefetching & Fallbacks**: Showcases how prefetching via `Link` components enhances user experience while maintaining functionality without JavaScript.
- **SVG Integration**: Illustrates custom SVG use in Next.js, providing interactive elements with minimal performance impact.

## Personal Inspiration

The project originated as a personal gift idea, repurposing exhibition content into a keepsake. It has since evolved into a showcase of modern Next.js capabilities, particularly in delivering smooth, accessible, and multi-language digital experiences.
