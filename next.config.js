const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

const fs = require('fs').promises;
const path = require('path');

const manifestTransform = async (entries) => {
  const manifest = entries.map(entry => {
    // Add revision for HTML files that don't have one
    if (entry.url.endsWith('.html') && !entry.revision) {
      entry.revision = Date.now().toString();
    }
    
    // Add integrity checks for important assets
    if (entry.url.startsWith('van-gogh-assets/')) {
      // You would need to implement getIntegrityHash()
      entry.integrity = getIntegrityHash(entry.url);
    }
    
    return entry;
  });

  return {
    manifest,
    warnings: [],
  };
};

// Add UUID generation for revision
const revision = crypto.randomUUID();

const SUPPORTED_LOCALES = ['en-GB', 'zh-TW', 'zh-CN'];

// Updated function to generate audio precache entries for all locales
const generateAudioPrecacheEntries = async () => {
  try {
    const audioEntries = [];
    
    for (const locale of SUPPORTED_LOCALES) {
      const filePath = path.join(process.cwd(), `public/van-gogh-assets/${locale}_rooms.json`);
      const roomsJson = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(roomsJson);
      
      // Add room audio entries for this locale
      data.rooms.forEach((room, index) => {
        const roomNumber = index + 1;
        audioEntries.push({
          url: `/van-gogh-assets/${locale}.room-${roomNumber}.aac`,
          revision
        });
        
        // Add painting audio entries for this locale
        room.paintings.forEach(painting => {
          audioEntries.push({
            url: `/van-gogh-assets/${locale}.painting-${roomNumber}-${painting.paintingNumber}.aac`,
            revision
          });
        });
      });
    }
    
    return audioEntries;
  } catch (error) {
    console.error('Error generating audio precache entries:', error);
    return [];
  }
};

// Updated function to generate image precache entries
const generateImagePrecacheEntries = async () => {
  try {
    const imageEntries = [];
    const imageFiles = ['p21.png', 'p27.png', 'p33.png', 'p44.png', 'p8.png', 'r3.png', 'r6.png'];
    
    imageFiles.forEach(imageFile => {
      imageEntries.push({
        url: `/van-gogh-assets/${imageFile}`,
        revision
      });
    });
    
    return imageEntries;
  } catch (error) {
    console.error('Error generating image precache entries:', error);
    return [];
  }
};

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.cache = false;
      return config;
    },
    images: {
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    }
  };

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    // const audioEntries = await generateAudioPrecacheEntries(); // Commented out audio entries
    const imageEntries = await generateImagePrecacheEntries();
    
    const withSerwist = (await import("@serwist/next")).default({
      cacheOnNavigation: true,
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
      disable: process.env.NODE_ENV === 'development',
      manifestTransforms: [manifestTransform],
      additionalPrecacheEntries: [
        { url: '/van-gogh/offline', revision },
        { url: '/van-gogh-assets/fallback-image.jpg', revision },
        { url: '/van-gogh-assets/silence.aac', revision },
        ...imageEntries, // Add the dynamically generated image entries
        // ...audioEntries, // Commented out audio entries
      ],
      include: [
        /\.(?:js|css|html|json|ico)$/,
        /\/van-gogh-assets\/.*\.(png|jpg|jpeg|webp|gif|svg|mp3|aac|wav)$/i
      ],
      register: true,
      reloadOnOnline: false,
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
}; 