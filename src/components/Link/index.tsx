import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

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

export function isExternalNavigationHref(href: string) {
  return (
    /^https?:\/\//.test(href) ||
    /^mailto:/i.test(href) ||
    /^tel:/i.test(href) ||
    href.startsWith('//')
  )
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

  const targetHref = href
  const NavLink = isExternalNavigationHref(targetHref) ? NextLink : Link

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <NavLink
        className={cn(className)}
        href={targetHref}
        onClick={onClick}
        {...newTabProps}
      >
        {label && label}
        {children && children}
      </NavLink>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <NavLink className={cn(className)} href={targetHref} onClick={onClick} {...newTabProps}>
        {label && label}
        {children && children}
      </NavLink>
    </Button>
  )
}
