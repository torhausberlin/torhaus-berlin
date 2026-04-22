import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Media, Page, Post, Config } from '../payload-types'
import { routing, type AppLocale } from '@/i18n/routing'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import {
  defaultLocalePathForPage,
  defaultLocalePathForPost,
  pathnameWithLocale,
  toAbsoluteSeoUrl,
} from './seoPaths'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/og-image.jpg'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

type CollectionSlug = 'pages' | 'posts'

async function buildAlternates(
  collection: CollectionSlug,
  id: string | number,
  currentLocale: AppLocale,
  basePath: string,
): Promise<{ canonical: string; languages?: Record<string, string> }> {
  const payload = await getPayload({ config: configPromise })
  const languages: Record<string, string> = {}

  for (const loc of routing.locales) {
    try {
      const localized = await payload.findByID({
        collection,
        id: String(id),
        locale: loc,
        select: { slug: true },
      })
      const slug = typeof localized?.slug === 'string' ? localized.slug : null
      if (!slug) continue
      const path =
        collection === 'pages' ? defaultLocalePathForPage(slug) : defaultLocalePathForPost(slug)
      languages[loc] = toAbsoluteSeoUrl(pathnameWithLocale(path, loc))
    } catch {
      // Missing locale version — omit from hreflang
    }
  }

  const canonical = toAbsoluteSeoUrl(pathnameWithLocale(basePath, currentLocale))

  return {
    canonical,
    languages: Object.keys(languages).length > 0 ? languages : undefined,
  }
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  collection: CollectionSlug
  locale: AppLocale
}): Promise<Metadata> => {
  const { doc, collection, locale } = args

  const title = doc?.meta?.title ? doc?.meta?.title : 'Torhaus Berlin e.V.'

  if (!doc) {
    return {
      title,
    }
  }

  const slug = typeof doc.slug === 'string' ? doc.slug : null
  const basePath =
    slug == null
      ? '/'
      : collection === 'pages'
        ? defaultLocalePathForPage(slug)
        : defaultLocalePathForPost(slug)

  const ogImage = getImageURL(doc?.meta?.image)
  const alternates =
    doc.id != null
      ? await buildAlternates(collection, doc.id, locale, basePath)
      : { canonical: toAbsoluteSeoUrl(pathnameWithLocale(basePath, locale)) }

  return {
    description: doc?.meta?.description,
    title,
    alternates: {
      canonical: alternates.canonical,
      ...(alternates.languages ? { languages: alternates.languages } : {}),
    },
    openGraph: mergeOpenGraph({
      ...(doc?.meta?.description?.trim() ? { description: doc.meta.description } : {}),
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: alternates.canonical,
    }),
  }
}
