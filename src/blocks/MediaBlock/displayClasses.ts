export type MediaBlockDisplay = 'all' | 'mobile' | 'desktop'

/** Tailwind visibility: mobile = below `lg`, desktop = `lg` and up (matches two-column breakpoint). */
export function mediaBlockDisplayClassName(
  display: MediaBlockDisplay | string | null | undefined,
): string {
  switch (display) {
    case 'mobile':
      return 'lg:hidden'
    case 'desktop':
      return 'hidden lg:flex'
    default:
      return ''
  }
}
