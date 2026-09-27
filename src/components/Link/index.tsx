import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Link } from '@/i18n/navigation'
import React from 'react'

import type { Page, Post } from '@/payload-types'
import { buildLinkRel, isNonAppHref } from '@/utilities/linkResolver'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

/** Locale-agnostic path for next-intl `Link` / active-state checks. */
export function resolveCMSLinkHref({
  type,
  reference,
  url,
}: Pick<CMSLinkType, 'type' | 'reference' | 'url'>): string | null {
  if (
    type === 'reference' &&
    reference?.value &&
    typeof reference.value === 'object' &&
    'slug' in reference.value &&
    reference.value.slug
  ) {
    const slug = reference.value.slug
    if (reference.relationTo === 'pages') {
      return slug === 'home' ? '/' : `/${slug}`
    }
    return `/${reference.relationTo}/${slug}`
  }
  const trimmed = url?.trim()
  return trimmed || null
}

/** @deprecated Prefer `isNonAppHref` from `@/utilities/linkResolver`. */
export function isExternalNavigationHref(href: string) {
  return isNonAppHref(href)
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    onClick,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href = resolveCMSLinkHref({ type, reference, url })

  if (!href) return null

  const rel = buildLinkRel({ url: href, newTab })
  const relProps = rel ? { rel } : {}
  const newTabProps = newTab ? { target: '_blank' as const } : {}
  const size = appearance === 'link' ? 'clear' : sizeFromProps

  const content = (
    <>
      {label && label}
      {children && children}
    </>
  )

  const anchor = isNonAppHref(href) ? (
    <a className={cn(className)} href={href} onClick={onClick} {...newTabProps} {...relProps}>
      {content}
    </a>
  ) : (
    <Link className={cn(className)} href={href} onClick={onClick} {...newTabProps} {...relProps}>
      {content}
    </Link>
  )

  if (appearance === 'inline') {
    return anchor
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      {anchor}
    </Button>
  )
}
