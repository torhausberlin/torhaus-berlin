import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { JsonLd } from '@/components/JsonLd'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { routing, toPayloadLocale, type AppLocale } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'
import { getServerSideURL } from '@/utilities/getURL'
import { pathnameWithLocale, toAbsoluteSeoUrl } from '@/utilities/seoPaths'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const slugParams = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return routing.locales.flatMap((locale) => slugParams.map((p) => ({ ...p, locale })))
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', locale } = await paramsPromise
  setRequestLocale(locale)
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug, locale: toPayloadLocale(locale) })

  if (!post) return <PayloadRedirects url={url} />

  const basePath = `/posts/${decodedSlug}`
  const articleUrl = toAbsoluteSeoUrl(pathnameWithLocale(basePath, toPayloadLocale(locale)))
  const published = post.publishedAt || post.createdAt
  const imageUrl =
    post.heroImage && typeof post.heroImage === 'object' && 'url' in post.heroImage && post.heroImage.url
      ? getServerSideURL() + (post.heroImage as { url: string }).url
      : undefined

  return (
    <article className="pb-16 pt-0">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          ...(imageUrl && { image: [imageUrl] }),
          datePublished: published,
          dateModified: post.updatedAt,
          mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
          publisher: {
            '@type': 'Organization',
            name: 'Torhaus Berlin e.V.',
            url: toAbsoluteSeoUrl('/'),
          },
        }}
      />
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale } = await paramsPromise
  setRequestLocale(locale)
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug, locale: toPayloadLocale(locale) })

  return generateMeta({
    doc: post,
    collection: 'posts',
    locale: toPayloadLocale(locale),
  })
}

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: AppLocale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
