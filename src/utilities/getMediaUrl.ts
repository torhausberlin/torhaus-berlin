/**
 * Public origin for media files (Payload `/api/media/...` or `/media/...`).
 * Use `NEXT_PUBLIC_MEDIA_URL` when the app runs on one host (e.g. local CMS) but files are served from production.
 */
export function getPublicMediaBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_SERVER_URL || ''
  return raw.replace(/\/+$/, '')
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith('//')
}

function withCacheTag(url: string, cacheTag?: string | null): string {
  if (!cacheTag || cacheTag === '') return url
  const tag = encodeURIComponent(cacheTag)
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}${tag}`
}

/**
 * Resolves a media URL for the browser / Next.js Image.
 *
 * - Relative paths get `getPublicMediaBaseUrl()` prepended when it is set (cross-origin media).
 * - Already-absolute URLs are returned unchanged (aside from cache busting).
 * - When no base is set, relative URLs stay relative (same-origin / localPatterns).
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const base = getPublicMediaBaseUrl()
  let resolved = url

  if (!isAbsoluteUrl(url) && base) {
    const path = url.startsWith('/') ? url : `/${url}`
    resolved = `${base}${path}`
  }

  return withCacheTag(resolved, cacheTag)
}
