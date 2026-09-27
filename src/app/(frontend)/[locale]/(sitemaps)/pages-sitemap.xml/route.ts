import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { routing } from '@/i18n/routing'
import {
  defaultLocalePathForPage,
  pathnameWithLocale,
  toAbsoluteSeoUrl,
} from '@/utilities/seoPaths'

function locEntries(defaultPath: string, lastmod: string) {
  return routing.locales.map((locale) => ({
    loc: toAbsoluteSeoUrl(pathnameWithLocale(defaultPath, locale)),
    lastmod,
  }))
}

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const [pages, latestPosts] = await Promise.all([
      payload.find({
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
      }),
      payload.find({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1,
        pagination: false,
        sort: '-updatedAt',
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          updatedAt: true,
        },
      }),
    ])

    const dateFallback = new Date().toISOString()
    const postsListLastmod = latestPosts.docs[0]?.updatedAt || dateFallback
    const defaultSitemap = locEntries('/posts', postsListLastmod)

    const sitemap = pages.docs
      ? pages.docs.flatMap((page) => {
          if (!page?.slug) return []
          return locEntries(defaultLocalePathForPage(page.slug), page.updatedAt || dateFallback)
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
