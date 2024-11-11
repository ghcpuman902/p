const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  maximumFileSizeToCacheInBytes: 5*1024*1024 // 5MB
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false
    config.infrastructureLogging = { debug: /PackFileCache/ }
    return config
  }
}

module.exports = withPWA(nextConfig) 