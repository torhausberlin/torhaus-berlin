'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/utilities/ui'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

export const LocaleSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations('LocaleSwitcher')
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="sr-only">{t('label')}</span>
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={cn(
            'uppercase tracking-wide transition-opacity',
            loc === locale ? 'opacity-100 font-semibold' : 'opacity-60 hover:opacity-100',
          )}
          prefetch={false}
        >
          {loc}
        </Link>
      ))}
    </div>
  )
}
