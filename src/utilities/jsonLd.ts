import { routing, type AppLocale } from '@/i18n/routing'

import { getServerSideURL } from './getURL'

export const SITE_NAME = 'Torhaus Berlin e.V.'

export function siteOrigin(): string {
  return getServerSideURL().replace(/\/$/, '')
}

export function organizationId(): string {
  return `${siteOrigin()}/#organization`
}

export function websiteId(): string {
  return `${siteOrigin()}/#website`
}

export function openGraphLocale(locale: AppLocale): string {
  return locale === 'de' ? 'de_DE' : 'en_US'
}

export function openGraphAlternateLocales(locale: AppLocale): string[] {
  return routing.locales.filter((loc) => loc !== locale).map(openGraphLocale)
}

export function titled(pageTitle: string): string {
  const trimmed = pageTitle.trim()
  if (!trimmed) return SITE_NAME
  if (trimmed === SITE_NAME || trimmed.endsWith(` | ${SITE_NAME}`)) return trimmed
  return `${trimmed} | ${SITE_NAME}`
}

export function siteJsonLdGraph(): Record<string, unknown> {
  const origin = siteOrigin()
  const orgId = organizationId()

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: SITE_NAME,
        url: `${origin}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/logo.png`,
        },
        image: `${origin}/logo.png`,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId(),
        url: `${origin}/`,
        name: SITE_NAME,
        publisher: { '@id': orgId },
        inLanguage: [...routing.locales],
      },
    ],
  }
}

export function articleJsonLd(args: {
  headline: string
  url: string
  locale: AppLocale
  description?: string | null
  imageUrl?: string
  datePublished?: string | null
  dateModified?: string | null
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.headline,
    ...(args.description?.trim() ? { description: args.description } : {}),
    ...(args.imageUrl ? { image: [args.imageUrl] } : {}),
    ...(args.datePublished ? { datePublished: args.datePublished } : {}),
    ...(args.dateModified ? { dateModified: args.dateModified } : {}),
    inLanguage: args.locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': args.url },
    publisher: { '@id': organizationId() },
  }
}
