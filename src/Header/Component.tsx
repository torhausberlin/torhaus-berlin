import { HeaderClient } from './Component.client'
import { toPayloadLocale } from '@/i18n/routing'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

type Props = {
  locale: string
}

export async function Header({ locale }: Props) {
  const payloadLocale = toPayloadLocale(locale)
  const headerData = await getCachedGlobal('header', 2, payloadLocale)()

  return <HeaderClient data={headerData} />
}
