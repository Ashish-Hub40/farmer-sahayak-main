import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "plant.id",
      },
    ],
    // Optimize images from Vercel Blob
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Note: next-pwa doesn't support Next.js 16 with Turbopack yet.
  // Removing the `turbopack` config forces Next.js to fallback to webpack for build.
};

// Note: next-pwa doesn't support Next.js 16 with Turbopack yet
// PWA will be handled via service worker in production
export default nextConfig;
