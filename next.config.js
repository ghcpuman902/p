/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    webpack: (config) => {
      config.cache = false;
      config.infrastructureLogging = { debug: /PackFileCache/ };
      return config;
    }
  };

  return nextConfig;
}; 