import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]

/** Align Next.js route `locale` with Payload CMS locale codes. */
export function toPayloadLocale(locale: string): AppLocale {
  if ((routing.locales as readonly string[]).includes(locale)) {
    return locale as AppLocale
  }
  return routing.defaultLocale as AppLocale
}
