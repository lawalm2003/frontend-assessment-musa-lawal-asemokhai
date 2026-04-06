import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    // Serve modern formats automatically
    formats: ['image/avif', 'image/webp'],
  },

  // Cloudflare Cache-Control for static assets
  async headers() {
    return [
      {
        // Next.js content-hashes all _next/static files on every build,
        // so they are safe to cache immutably for 1 year.
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Public folder assets (favicon, og images, etc.)
        source: '/static/:path*',
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

export default nextConfig;
