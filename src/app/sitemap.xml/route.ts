import { routing } from '@/i18n/routing'
import { getServerSideURL } from '@/utilities/getURL'

/**
 * Sitemap index at `/sitemap.xml` listing Payload-backed URL sets.
 * Per-locale route handlers (same data for all locales) live under
 * `/{locale}/(sitemaps)/*.xml`.
 */
export function GET() {
  const base = getServerSideURL().replace(/\/$/, '')
  const locale = routing.defaultLocale
  const loc = (path: string) => `${base}${path}`

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${loc(`/${locale}/pages-sitemap.xml`)}</loc>
  </sitemap>
  <sitemap>
    <loc>${loc(`/${locale}/posts-sitemap.xml`)}</loc>
  </sitemap>
</sitemapindex>`

  return new Response(indexXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
