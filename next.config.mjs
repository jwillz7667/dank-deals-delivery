import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // 1 hour cache
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
  
  // Enable React Compiler for automatic optimizations
  experimental: {
    reactCompiler: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Enable runtime optimizations
    serverMinification: true,
    // Turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Enhanced modular imports
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
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' blob: data:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
              "frame-src 'self' https://www.youtube.com https://youtube.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
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
        source: '/:path*.{jpg,jpeg,png,gif,ico,svg,webp,avif}',
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
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/api/age-verify',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize chunks for better loading
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 150000, // Smaller max size for better caching
        cacheGroups: {
          default: false,
          vendors: false,
          
          // Critical components bundle - smallest, highest priority
          critical: {
            name: 'critical',
            chunks: 'all',
            test: /[\\/](components[\\/](hero-section|header|client-home-page))/,
            priority: 40,
            enforce: true,
            maxSize: 100000
          },
          
          // Auth-related chunks - defer until needed
          auth: {
            name: 'auth',
            chunks: 'all',
            test: /[\\/](@stackframe[\\/]stack|auth|verification)/,
            priority: 35,
            enforce: true
          },
          
          // UI components bundle - separate from critical
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]components[\\/]ui[\\/]/,
            priority: 30,
            enforce: true,
            maxSize: 80000
          },
          
          // Radix UI components - separate chunk since they're heavy
          radix: {
            name: 'radix',
            chunks: 'all',
            test: /[\\/]@radix-ui[\\/]/,
            priority: 28,
            enforce: true,
            maxSize: 120000
          },
          
          // Analytics and tracking - can be deferred
          analytics: {
            name: 'analytics',
            chunks: 'all',
            test: /[\\/](analytics|tracking|plausible|gtag)/,
            priority: 25,
            enforce: true
          },
          
          // Charts and dashboard components - only load when needed
          charts: {
            name: 'charts',
            chunks: 'all',
            test: /[\\/](recharts|chart|dashboard)/,
            priority: 23,
            enforce: true
          },
          
          // Icon libraries - optimize separately
          icons: {
            name: 'icons',
            chunks: 'all',
            test: /[\\/](lucide-react|@iconify|heroicons)/,
            priority: 22,
            enforce: true,
            maxSize: 60000
          },
          
          // Large vendor libraries - split by size/usage
          vendorLarge: {
            name: 'vendor-large',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 20,
            enforce: true,
            maxSize: 200000
          },
          
          // Medium vendor libraries
          vendorMedium: {
            name: 'vendor-medium',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](drizzle|zod|ai|stripe)[\\/]/,
            priority: 18,
            enforce: true,
            maxSize: 150000
          },
          
          // Utility libraries
          vendorUtils: {
            name: 'vendor-utils',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](clsx|tailwind|class-variance|date-fns)[\\/]/,
            priority: 16,
            enforce: true,
            maxSize: 100000
          },
          
          // Remaining vendor code
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            maxSize: 120000,
          },
          
          // Common components
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
            maxSize: 100000
          }
        }
      }
      
      // Optimize for LCP by preloading critical chunks
      config.optimization.runtimeChunk = {
        name: 'runtime'
      }
      
      // Improve module concatenation
      config.optimization.concatenateModules = true
      
      // Enable side effects optimization
      config.optimization.sideEffects = false
    }
    
    return config
  },
}

// Wrap config with MDX
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
