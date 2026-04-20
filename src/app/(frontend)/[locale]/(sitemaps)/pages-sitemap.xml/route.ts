import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { routing } from '@/i18n/routing'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const localized = (pathname: string) => {
      const path = pathname.startsWith('/') ? pathname : `/${pathname}`
      return routing.locales.flatMap((locale) => {
        if (locale === routing.defaultLocale) {
          return [{ loc: `${SITE_URL}${path === '/' ? '/' : path}`, lastmod: dateFallback }]
        }
        const prefix = path === '/' ? `/${locale}` : `/${locale}${path}`
        return [{ loc: `${SITE_URL}${prefix}`, lastmod: dateFallback }]
      })
    }

    const defaultSitemap = [...localized('/posts')]

    const sitemap = results.docs
      ? results.docs.flatMap((page) => {
          if (!page?.slug) return []
          const path = page.slug === 'home' ? '/' : `/${page.slug}`
          return routing.locales.map((locale) => {
            const loc =
              locale === routing.defaultLocale
                ? `${SITE_URL}${path === '/' ? '/' : path}`
                : `${SITE_URL}/${locale}${path === '/' ? '' : path}`
            return {
              loc,
              lastmod: page.updatedAt || dateFallback,
            }
          })
        })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
