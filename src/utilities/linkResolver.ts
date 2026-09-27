const SOCIAL_HOSTS = [
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'tiktok.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'youtu.be',
] as const

const stripWww = (hostname: string): string => hostname.replace(/^www\./i, '').toLowerCase()

const parseHostname = (url: string): string | null => {
  try {
    const normalized = url.startsWith('//') ? `https:${url}` : url
    if (!/^https?:\/\//i.test(normalized)) return null
    return new URL(normalized).hostname
  } catch {
    return null
  }
}

const hostMatches = (hostname: string, allowed: string): boolean => {
  const host = stripWww(hostname)
  const allowedHost = stripWww(allowed)
  return host === allowedHost || host.endsWith(`.${allowedHost}`)
}

const firstPartyHosts = (): string[] => {
  const hosts: string[] = []
  for (const envUrl of [process.env.NEXT_PUBLIC_SERVER_URL, process.env.NEXT_PUBLIC_MEDIA_URL]) {
    if (!envUrl) continue
    const hostname = parseHostname(/^https?:\/\//i.test(envUrl) ? envUrl : `https://${envUrl}`)
    if (hostname) hosts.push(stripWww(hostname))
  }
  return hosts
}

/** Absolute http(s) or protocol-relative URL — not mailto/tel/relative. */
export const isExternalUrl = (url: string): boolean =>
  /^https?:\/\//i.test(url) || url.startsWith('//')

/** hrefs that must not go through next-intl `Link`. */
export const isNonAppHref = (url: string): boolean =>
  isExternalUrl(url) || /^mailto:/i.test(url) || /^tel:/i.test(url)

export const shouldNofollowUrl = (url: string): boolean => {
  if (!isExternalUrl(url)) return false
  const hostname = parseHostname(url)
  if (!hostname) return true
  if (firstPartyHosts().some((h) => hostMatches(hostname, h))) return false
  if (SOCIAL_HOSTS.some((h) => hostMatches(hostname, h))) return false
  return true
}

export const buildLinkRel = (opts: {
  url: string
  newTab?: boolean | null
}): string | undefined => {
  const parts: string[] = []
  if (opts.newTab) {
    parts.push('noopener', 'noreferrer')
  }
  if (shouldNofollowUrl(opts.url)) {
    parts.push('nofollow')
  }
  return parts.length ? [...new Set(parts)].join(' ') : undefined
}
