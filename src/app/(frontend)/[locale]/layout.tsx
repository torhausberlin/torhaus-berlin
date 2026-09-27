import type { Metadata } from 'next'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { JsonLd } from '@/components/JsonLd'
import { routing, type AppLocale } from '@/i18n/routing'
import {
  SITE_NAME,
  openGraphAlternateLocales,
  openGraphLocale,
  siteJsonLdGraph,
} from '@/utilities/jsonLd'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  setRequestLocale(locale)
  const t = await getTranslations('Site')
  const l = locale as AppLocale
  const description = t('defaultDescription')

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      locale: openGraphLocale(l),
      alternateLocale: openGraphAlternateLocales(l),
      title: SITE_NAME,
    }),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd data={siteJsonLdGraph()} />
      <Header locale={locale} />
      {/* Match fixed header bar height (see HeaderClient: py-3 + size-11 + border; md: py-4 + size-20). */}
      <div className="max-lg:pt-[calc(0.75rem+2.75rem+0.75rem+3px)] md:max-lg:pt-[calc(1rem+5rem+1rem+3px)]">
        {children}
      </div>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  )
}
