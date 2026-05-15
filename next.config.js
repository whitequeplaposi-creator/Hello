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
  },
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  // removeConsole removed: keeping console logs in production for Vercel function logs
}

module.exports = nextConfig
