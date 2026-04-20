'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Link } from '@/i18n/navigation'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

function isValidExternalUrl(value: string) {
  return /^https?:\/\//.test(value) || value.startsWith('//') || value.startsWith('mailto:') || value.startsWith('tel:')
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const t = useTranslations('Header')
  const navItems = data?.navItems || []
  const externalImageLinks = data?.externalImageLinks || []

  return (
    <nav className="flex gap-3 items-center">
      {externalImageLinks.map((row, i) => {
        const { image, openInNewTab, url } = row
        if (!url || !image || typeof image !== 'object') return null
        const rel = openInNewTab !== false ? 'noopener noreferrer' : undefined
        const target = openInNewTab !== false ? '_blank' : undefined
        const className = 'inline-flex items-center shrink-0 opacity-90 hover:opacity-100 transition-opacity'

        if (!isValidExternalUrl(url)) {
          return (
            <span className={className} key={`ext-${i}`} title={url}>
              <Media imgClassName="h-8 w-auto max-w-[120px] object-contain" resource={image} />
            </span>
          )
        }

        return (
          <a className={className} href={url} key={`ext-${i}`} rel={rel} target={target}>
            <Media imgClassName="h-8 w-auto max-w-[120px] object-contain" resource={image} />
          </a>
        )
      })}
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <LocaleSwitcher className="text-muted-foreground gap-3" />
      <Link href="/search">
        <span className="sr-only">{t('search')}</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
