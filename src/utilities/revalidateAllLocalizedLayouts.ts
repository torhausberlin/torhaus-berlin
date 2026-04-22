import { revalidatePath } from 'next/cache'

import { routing } from '@/i18n/routing'

/**
 * Revalidates the [locale] layout tree for every app locale (default and prefixed),
 * so static/ISR pages pick up data that is not its own `unstable_cache` entry (e.g. globals,
 * or blocks that fetch in the page tree without a shared tag).
 */
export function revalidateAllLocalizedLayouts() {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) {
      revalidatePath('/', 'layout')
    } else {
      revalidatePath(`/${locale}`, 'layout')
    }
  }
}
