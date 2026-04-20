import { revalidatePath } from 'next/cache'

import { routing } from '@/i18n/routing'

/** Revalidates a pathname for the default locale and every prefixed non-default locale (e.g. `/de/...`). */
export function revalidateLocalizedPaths(pathname: string) {
  revalidatePath(pathname)

  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue
    const localized = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
    revalidatePath(localized)
  }
}
