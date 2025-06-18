/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache for better performance
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  
  // Enhanced experimental features for better performance (Next.js 15 compatible)
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      'framer-motion',
      'react-hook-form',
    ],
    // Enable static generation optimizations
    webVitalsAttribution: ['CLS', 'LCP'],
    // Optimize CSS imports
    optimizeCss: true,
  },
  
  // Enhanced modular imports for better tree shaking
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
      preventFullImport: true,
    },
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
      preventFullImport: true,
    },
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' blob: data:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stackframe.cloud",
              "frame-src 'self' https://www.youtube.com https://youtube.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Enhanced caching for static assets
      {
        source: '/hero-videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Enhanced font caching
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Enhanced webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize chunks for better loading
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Create specific vendor chunks for better caching
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Group UI components
            ui: {
              name: 'ui',
              chunks: 'all',
              test: /[\\/]components[\\/]ui[\\/]/,
              priority: 15,
              reuseExistingChunk: true,
            },
            // Group Radix UI components
            radix: {
              name: 'radix',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            // Group Lucide icons
            icons: {
              name: 'icons',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      }
    }
    
    // Bundle analyzer for production analysis
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')()
      config.plugins.push(new BundleAnalyzerPlugin())
    }
    
    // Optimize CSS
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer || []
    }
    
    return config
  },
}

export default nextConfig
