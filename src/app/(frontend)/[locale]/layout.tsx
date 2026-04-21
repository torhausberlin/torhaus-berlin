import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { AdminBar } from '@/components/AdminBar'
import { DocumentLang } from '@/components/DocumentLang'
import { routing } from '@/i18n/routing'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { draftMode } from 'next/headers'
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
  const { isEnabled: preview } = await draftMode()

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <DocumentLang />
      {/* <AdminBar
        adminBarProps={{
          preview,
        }}
      /> */}
      <Header locale={locale} />
      <div className="max-lg:pt-[4.75rem]">{children}</div>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  )
}
