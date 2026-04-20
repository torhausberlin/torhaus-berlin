import { Link } from '@/i18n/navigation'
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const locale = await getLocale()
  setRequestLocale(locale)
  const t = await getTranslations('NotFound')

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>{t('title')}</h1>
        <p className="mb-4">{t('description')}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{t('goHome')}</Link>
      </Button>
    </div>
  )
}
