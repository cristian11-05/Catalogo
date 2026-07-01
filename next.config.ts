import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' }
    ],
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
}

export default nextConfig
