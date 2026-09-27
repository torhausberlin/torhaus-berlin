import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import type { Media, Page, Post, Config } from '../payload-types'
import type { AppLocale } from '@/i18n/routing'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import {
  SITE_NAME,
  openGraphAlternateLocales,
  openGraphLocale,
  titled,
} from './jsonLd'
import {
  defaultLocalePathForPage,
  defaultLocalePathForPost,
  pathnameWithLocale,
  toAbsoluteSeoUrl,
  alternatesForDefaultPath,
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

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  collection: 'pages' | 'posts'
  locale: AppLocale
}): Promise<Metadata> => {
  const { doc, collection, locale } = args
  const t = await getTranslations('Site')
  const fallbackDescription = t('defaultDescription')

  if (!doc) {
    return {
      title: { absolute: SITE_NAME },
      description: fallbackDescription,
    }
  }

  const slug = typeof doc.slug === 'string' ? doc.slug : null
  const basePath =
    slug == null
      ? '/'
      : collection === 'pages'
        ? defaultLocalePathForPage(slug)
        : defaultLocalePathForPost(slug)

  const metaTitle = doc.meta?.title?.trim()
  const docTitle = typeof doc.title === 'string' ? doc.title.trim() : ''
  const title: Metadata['title'] = metaTitle
    ? { absolute: metaTitle }
    : docTitle || { absolute: SITE_NAME }
  const ogTitle = metaTitle || titled(docTitle)
  const description = doc.meta?.description?.trim() || fallbackDescription

  const ogImage = getImageURL(doc.meta?.image)
  const alternates =
    slug != null
      ? alternatesForDefaultPath(basePath, locale)
      : { canonical: toAbsoluteSeoUrl(pathnameWithLocale(basePath, locale)) }

  return {
    description,
    title,
    alternates: {
      canonical: alternates.canonical,
      ...('languages' in alternates && alternates.languages
        ? { languages: alternates.languages }
        : {}),
    },
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      locale: openGraphLocale(locale),
      alternateLocale: openGraphAlternateLocales(locale),
      title: ogTitle,
      url: alternates.canonical,
    }),
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
