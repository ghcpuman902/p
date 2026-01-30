const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

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
      qualities: [25, 50, 75, 100],
    },
    experimental: {
      optimizePackageImports: ['lucide-react'],
    },
    // Enable service worker registration
    headers: async () => {
      return [
        {
          source: '/sw.js',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
            {
              key: 'Service-Worker-Allowed',
              value: '/',
            },
          ],
        },
        // Add font optimization headers
        {
          source: '/_next/static/media/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  };

  return nextConfig;
}; 