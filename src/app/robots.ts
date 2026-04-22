import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

/** Root robots.txt (Next.js Metadata Route, Next 13+ / 16). */
export default function robots(): MetadataRoute.Robots {
  const base = getServerSideURL().replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
