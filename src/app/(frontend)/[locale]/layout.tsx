import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { JsonLd } from '@/components/JsonLd'
import { routing, type AppLocale } from '@/i18n/routing'
import { toAbsoluteSeoUrl, pathnameWithLocale } from '@/utilities/seoPaths'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const l = locale as AppLocale
  const siteUrl = toAbsoluteSeoUrl(pathnameWithLocale('/', l))

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Torhaus Berlin e.V.',
            url: siteUrl,
            publisher: { '@id': `${siteUrl}#organization` },
          },
          {
            '@context': 'https://schema.org',
            '@id': `${siteUrl}#organization`,
            '@type': 'Organization',
            name: 'Torhaus Berlin e.V.',
            url: siteUrl,
          },
        ]}
      />
      <Header locale={locale} />
      {/* Match fixed header bar height (see HeaderClient: py-3 + size-11 + border; md: py-4 + size-20). */}
      <div className="max-lg:pt-[calc(0.75rem+2.75rem+0.75rem+3px)] md:max-lg:pt-[calc(1rem+5rem+1rem+3px)]">
        {children}
      </div>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  )
}
