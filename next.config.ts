import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const defaultSiteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:4000'

function withHttpScheme(url: string): string {
  const t = url.trim()
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  return `https://${t}`
}

const imageRemoteOriginStrings = [defaultSiteUrl]
for (const raw of [process.env.NEXT_PUBLIC_SERVER_URL, process.env.NEXT_PUBLIC_MEDIA_URL]) {
  if (!raw?.trim()) continue
  imageRemoteOriginStrings.push(withHttpScheme(raw))
}

const imageRemotePatterns = Array.from(
  new Map(
    imageRemoteOriginStrings.flatMap((item) => {
      try {
        const url = new URL(item)
        const key = `${url.protocol}//${url.hostname}`
        return [
          [
            key,
            {
              hostname: url.hostname,
              protocol: url.protocol.replace(':', '') as 'http' | 'https',
            },
          ],
        ] as const
      } catch {
        return []
      }
    }),
  ).values(),
)

const securityHeaders: { key: string; value: string }[] = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

if (process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  })
}

const robotsNoindexHeader = { key: 'X-Robots-Tag', value: 'noindex, nofollow' }

const nextConfig: NextConfig = {
  // Keep node-ical + Temporal deps out of the RSC bundle (avoids BigInt/runtime errors when parsed).
  serverExternalPackages: ['node-ical', 'temporal-polyfill', 'rrule-temporal'],
  async headers() {
    return [
      {
        source: '/',
        headers: securityHeaders,
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/admin',
        headers: [robotsNoindexHeader],
      },
      {
        source: '/admin/:path*',
        headers: [robotsNoindexHeader],
      },
      {
        source: '/next/:path*',
        headers: [robotsNoindexHeader],
      },
    ]
  },
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/logo.png' },
      { pathname: '/icons/**' },
    ],
    qualities: [75, 100],
    remotePatterns: [...imageRemotePatterns],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
