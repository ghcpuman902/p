# Van Gogh Assets Restructure Plan

## Current Folder Structure Analysis

### Main Directory: `public/van-gogh-assets/`

#### Current Organization Issues:
1. **Mixed file types in root**: AAC files, JSON files, images, and other assets all mixed together
2. **Multiple backup directories**: 4 backup folders with duplicate content
3. **Inconsistent naming**: Some files have different sizes across backups
4. **No clear separation by language or content type**
5. **MP3 files in separate subdirectory**: Inconsistent with AAC files in root

#### Current File Types Found:
- **Audio files**: `.aac` (main format), `.mp3` (in subdirectory)
- **Data files**: `.json` (room configurations for 3 languages)
- **Images**: `.png`, `.jpg`, `.svg`, `.ico`
- **Web assets**: `manifest.json`, service worker files

#### Language Support:
- `en-GB` (English)
- `zh-CN` (Simplified Chinese)
- `zh-TW` (Traditional Chinese)

#### Content Types:
- **Room audio**: `room-1.aac` through `room-7.aac`
- **Painting audio**: `painting-1-1.aac` through `painting-6-61.aac`
- **Configuration**: `{locale}_rooms.json`

## Proposed New Structure

```
public/van-gogh-assets/
├── audio/
│   ├── aac/
│   │   ├── en-GB/
│   │   │   ├── rooms/
│   │   │   │   ├── room-1.aac
│   │   │   │   ├── room-2.aac
│   │   │   │   ├── room-3.aac
│   │   │   │   ├── room-4.aac
│   │   │   │   ├── room-5.aac
│   │   │   │   ├── room-6.aac
│   │   │   │   └── room-7.aac
│   │   │   └── paintings/
│   │   │       ├── room-1/
│   │   │       │   ├── painting-1-1.aac
│   │   │       │   ├── painting-1-2.aac
│   │   │       │   └── painting-1-3.aac
│   │   │       ├── room-2/
│   │   │       │   ├── painting-2-4.aac
│   │   │       │   ├── painting-2-5.aac
│   │   │       │   └── ... (paintings 2-6 through 2-20)
│   │   │       ├── room-3/
│   │   │       │   ├── painting-3-21.aac
│   │   │       │   └── ... (paintings 3-21 through 3-28)
│   │   │       ├── room-4/
│   │   │       │   └── ... (paintings 4-29 through 4-34)
│   │   │       ├── room-5/
│   │   │       │   └── ... (paintings 5-35 through 5-46)
│   │   │       └── room-6/
│   │   │           └── ... (paintings 6-47 through 6-61)
│   │   ├── zh-CN/
│   │   │   ├── rooms/
│   │   │   └── paintings/
│   │   │       ├── room-1/
│   │   │       ├── room-2/
│   │   │       ├── room-3/
│   │   │       ├── room-4/
│   │   │       ├── room-5/
│   │   │       └── room-6/
│   │   └── zh-TW/
│   │       ├── rooms/
│   │       └── paintings/
│   │           ├── room-1/
│   │           ├── room-2/
│   │           ├── room-3/
│   │           ├── room-4/
│   │           ├── room-5/
│   │           └── room-6/
│   └── mp3/ (if needed for fallback)
│       ├── en-GB/
│       ├── zh-CN/
│       └── zh-TW/
├── data/
│   ├── en-GB_rooms.json
│   ├── zh-CN_rooms.json
│   └── zh-TW_rooms.json
├── images/
│   ├── paintings/
│   │   ├── p8.png
│   │   ├── p21.png
│   │   ├── p27.png
│   │   ├── p33.png
│   │   └── p44.png
│   ├── rooms/
│   │   ├── r3.png
│   │   └── r6.png
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   └── screenshots/
│       ├── screenshot-desktop.png
│       └── screenshot-mobile.png
├── web/
│   ├── manifest.json
│   ├── sw.js
│   └── service-worker-*.js
└── backups/ (optional - for reference)
    ├── backup_20250715_170834/
    ├── backup_20250715_170916/
    ├── backup_20250715_170938/
    └── backup_20250715_172554/
```

## Benefits of New Structure

1. **Clear separation by content type**: Audio, data, images, web assets
2. **Language-based organization**: Each language has its own directory
3. **Logical grouping**: Rooms and paintings are organized by room number
4. **Easier maintenance**: Clear structure makes it easier to add new content
5. **Better caching**: Service worker can cache by language/room/painting
6. **Reduced redundancy**: Single source of truth for each audio file
7. **Scalability**: Easy to add new languages or content types

## Implementation Steps

### Phase 1: Create New Directory Structure
1. Create the new folder hierarchy
2. Move JSON files to `data/` directory
3. Move images to appropriate subdirectories in `images/`
4. Move web assets to `web/` directory

### Phase 2: Reorganize Audio Files
1. Create language-specific directories under `audio/aac/`
2. Create `rooms/` and `paintings/` subdirectories for each language
3. Create room-specific subdirectories under `paintings/`
4. Move AAC files to their new locations
5. Optionally move MP3 files to `audio/mp3/` with same structure

### Phase 3: Update Code References
1. Update the VanGoghNavigation component to use new paths
2. Update service worker to handle new directory structure
3. Update any hardcoded paths in the application

### Phase 4: Cleanup
1. Remove backup directories (after verification)
2. Update documentation
3. Test all audio functionality

## New Audio Path Format

### Current format:
```
/van-gogh-assets/{locale}.{painting-id}.aac
/van-gogh-assets/{locale}.{room-id}.aac
```

### New format:
```
/van-gogh-assets/audio/aac/{locale}/paintings/room-{roomNumber}/{painting-id}.aac
/van-gogh-assets/audio/aac/{locale}/rooms/{room-id}.aac
```

## Code Updates Required

### VanGoghNavigation.tsx
Update the `setAudioSource` function to use new paths:

```typescript
const audioPath = currentPaintingId
    ? `/van-gogh-assets/audio/aac/${currentLocale}/paintings/room-${painting.roomNumber}/${currentPaintingId}.aac`
    : `/van-gogh-assets/audio/aac/${currentLocale}/rooms/${currentRoomId}.aac`
```

### Service Worker
Update caching strategies to handle new directory structure and potentially cache by room/language.

## File Count Summary

### Current State:
- **AAC files**: ~201 files per language × 3 languages = ~603 files
- **MP3 files**: ~201 files per language × 3 languages = ~603 files  
- **JSON files**: 3 files
- **Images**: ~10 files
- **Web assets**: ~5 files
- **Backup directories**: 4 directories with duplicate content

### After Restructure:
- **AAC files**: Same count, better organized
- **MP3 files**: Same count, better organized
- **JSON files**: 3 files in `data/` directory
- **Images**: ~10 files organized by type
- **Web assets**: ~5 files in `web/` directory
- **No backup directories**: Clean structure

## Next Steps

1. **Create the new directory structure**
2. **Move files systematically**
3. **Update code references**
4. **Test thoroughly**
5. **Remove old structure and backups** 