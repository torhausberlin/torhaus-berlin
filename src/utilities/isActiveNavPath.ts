import { isNonAppHref } from '@/utilities/linkResolver'

export function normalizeNavPath(p: string) {
  if (!p || p === '/') return '/'
  return p.replace(/\/$/, '') || '/'
}

/** Matches next-intl `usePathname()` to a CMS link href (locale-agnostic paths). */
export function isActiveNavPath(pathname: string, href: string | null) {
  if (!href || isNonAppHref(href)) return false
  const p = normalizeNavPath(pathname)
  const h = normalizeNavPath(href)
  if (h === '/') return p === '/'
  return p === h || p.startsWith(`${h}/`)
}
