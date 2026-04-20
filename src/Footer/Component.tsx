import { FooterClient } from './Component.client'
import { toPayloadLocale } from '@/i18n/routing'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

type Props = {
  locale: string
}

export async function Footer({ locale }: Props) {
  const payloadLocale = toPayloadLocale(locale)
  const footerData = await getCachedGlobal('footer', 2, payloadLocale)()

  return <FooterClient data={footerData} />
}
