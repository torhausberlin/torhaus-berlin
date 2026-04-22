import { type AppLocale, routing } from '@/i18n/routing'

import { getServerSideURL } from './getURL'

/**
 * Unprefixed path as used for the default locale (next-intl `as-needed`):
 * e.g. `/`, `/about`, `/posts`, `/posts/page/2`, `/posts/my-slug`
 */
export function defaultLocalePathForPage(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`
}

export function defaultLocalePathForPost(slug: string): string {
  return `/posts/${slug}`
}

/**
 * List route: first page is `/posts`; page 2+ is `/posts/page/n`.
 */
export function defaultLocalePathForPostsList(page: number): string {
  if (!Number.isInteger(page) || page < 1) return '/posts'
  if (page === 1) return '/posts'
  return `/posts/page/${page}`
}

/**
 * Add locale prefix for non-default locales, matching
 * [`pages-sitemap.xml`](src/app/(frontend)/[locale]/(sitemaps)/pages-sitemap.xml/route.ts).
 */
export function pathnameWithLocale(defaultLocalePath: string, locale: AppLocale): string {
  const path = defaultLocalePath.startsWith('/') ? defaultLocalePath : `/${defaultLocalePath}`
  if (locale === routing.defaultLocale) {
    return path === '' ? '/' : path
  }
  if (path === '/') {
    return `/${locale}`
  }
  return `/${locale}${path}`
}

export function toAbsoluteSeoUrl(pathname: string): string {
  const base = getServerSideURL().replace(/\/$/, '')
  if (pathname === '/' || pathname === '') {
    return `${base}/`
  }
  return `${base}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export function alternatesForDefaultPath(
  defaultPath: string,
  currentLocale: AppLocale,
): { canonical: string; languages: Record<string, string> } {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => {
      return [loc, toAbsoluteSeoUrl(pathnameWithLocale(defaultPath, loc))]
    }),
  ) as Record<string, string>
  return {
    canonical: toAbsoluteSeoUrl(pathnameWithLocale(defaultPath, currentLocale)),
    languages,
  }
}
