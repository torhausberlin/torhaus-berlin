import type { Config } from 'src/payload-types'

import type { AppLocale } from '@/i18n/routing'
import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(
  slug: T,
  depth = 0,
  locale?: AppLocale,
): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    ...(locale ? { locale } : {}),
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug.
 * Pass `locale` so localized globals (e.g. header `link`) resolve labels/URLs and populate relationships.
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0, locale?: AppLocale) =>
  unstable_cache(async () => getGlobal<T>(slug, depth, locale), [slug, String(depth), locale ?? 'all'], {
    tags: [`global_${slug}`],
  })
