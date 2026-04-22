import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { toPayloadLocale, type AppLocale } from '@/i18n/routing'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { alternatesForDefaultPath, defaultLocalePathForPostsList } from '@/utilities/seoPaths'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale } = await paramsPromise
  setRequestLocale(locale)
  const t = await getTranslations('Posts')
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    locale: toPayloadLocale(locale),
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t('title')}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale } = await paramsPromise
  setRequestLocale(locale)
  const t = await getTranslations('Posts')
  const l = toPayloadLocale(locale) as AppLocale
  const { canonical, languages } = alternatesForDefaultPath(defaultLocalePathForPostsList(1), l)
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: { canonical, languages },
    openGraph: mergeOpenGraph({
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      url: canonical,
    }),
  }
}
