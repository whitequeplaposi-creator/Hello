/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 7 days on Vercel CDN
    minimumCacheTTL: 604800,
    // Common device widths — avoids generating unnecessary sizes
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  // Compress responses
  compress: true,
  // Power header for CDN hints
  poweredByHeader: false,
}

module.exports = nextConfig
