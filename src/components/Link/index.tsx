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
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

function isExternalHref(href: string) {
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
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const targetHref = href || url || ''
  const NavLink = isExternalHref(targetHref) ? NextLink : Link

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <NavLink className={cn(className)} href={targetHref} {...newTabProps}>
        {label && label}
        {children && children}
      </NavLink>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <NavLink className={cn(className)} href={targetHref} {...newTabProps}>
        {label && label}
        {children && children}
      </NavLink>
    </Button>
  )
}
