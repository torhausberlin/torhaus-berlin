import type { Metadata, Viewport } from 'next'

import { fontNeueMachina, fontRobotoMono, fontRubik } from '@/fonts/app-fonts'
import { cn } from '@/utilities/ui'
import React from 'react'
import { getLocale } from 'next-intl/server'

import { Providers } from '@/providers'
import { defaultSiteDescription, mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let lang = 'en'
  try {
    lang = await getLocale()
  } catch {
    // Outside next-intl request (e.g. some tooling); keep default
  }
  return (
    <html
      className={cn(fontRubik.variable, fontNeueMachina.variable, fontRobotoMono.variable)}
      lang={lang}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {/* Next Metadata OpenGraph type has no `logo`; crawlers expect property="og:logo". */}
        <meta content={`${getServerSideURL()}/logo.png`} property="og:logo" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  description: defaultSiteDescription,
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fffd38',
  viewportFit: 'cover',
  colorScheme: 'light',
}
