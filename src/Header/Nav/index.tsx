'use client'

import { motion, useReducedMotion } from 'motion/react'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink, resolveCMSLinkHref } from '@/components/Link'
import { Media } from '@/components/Media'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { usePathname } from '@/i18n/navigation'
import { isActiveNavPath } from '@/utilities/isActiveNavPath'
import { cn } from '@/utilities/ui'

function isValidExternalUrl(value: string) {
  return (
    /^https?:\/\//.test(value) ||
    value.startsWith('//') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:')
  )
}

type ExternalImageLinkRow = NonNullable<HeaderType['externalImageLinks']>[number]

function ExternalImageLink({
  row,
  frameClass,
  imageClass,
  onNavigate,
}: {
  row: ExternalImageLinkRow
  frameClass: string
  imageClass: string
  onNavigate?: () => void
}) {
  const { image, openInNewTab, url } = row
  if (!url || !image || typeof image !== 'object') return null
  const rel = openInNewTab !== false ? 'noopener noreferrer' : undefined
  const target = openInNewTab !== false ? '_blank' : undefined

  if (!isValidExternalUrl(url)) {
    return (
      <span className={frameClass} title={url}>
        <Media imgClassName={imageClass} resource={image} />
      </span>
    )
  }

  return (
    <a className={frameClass} href={url} onClick={onNavigate} rel={rel} target={target}>
      <Media imgClassName={imageClass} resource={image} />
    </a>
  )
}

export type HeaderNavProps = {
  data: HeaderType
  variant?: 'desktop' | 'mobile'
  /** Close mobile menu after in-app navigation */
  onNavigate?: () => void
  /** Drives stagger-in when the mobile overlay is open */
  overlayOpen?: boolean
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  variant = 'desktop',
  onNavigate,
  overlayOpen = true,
}) => {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const navItems = data?.navItems || []
  const externalImageLinks = data?.externalImageLinks || []

  const linkClass = (active: boolean) =>
    cn(
      'font-sans text-sm font-medium tracking-tight text-black transition-opacity hover:opacity-70 md:text-lg',
      active ? 'underline underline-offset-4' : 'underline-transparent',
    )

  const mobileOverlayLinkClass = (active: boolean) =>
    cn(
      'text-center font-sans text-3xl font-semibold leading-tight tracking-tight text-black transition-opacity hover:opacity-70 sm:text-4xl',
      active ? 'underline underline-offset-[0.35em] decoration-2' : 'underline-transparent',
    )

  if (variant === 'mobile') {
    const reduce = prefersReducedMotion ?? false
    const overlayList = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduce ? 0 : 0.08,
          delayChildren: reduce ? 0 : 0.06,
        },
      },
    }
    const overlayItem = {
      hidden: {
        opacity: reduce ? 1 : 0,
        y: reduce ? 0 : -18,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: reduce
          ? { duration: 0 }
          : {
              type: 'spring' as const,
              stiffness: 380,
              damping: 34,
              mass: 0.85,
            },
      },
    }

    return (
      <motion.nav
        aria-label="Main"
        className="flex min-w-0 flex-col items-center gap-6 text-center"
        variants={overlayList}
        initial="hidden"
        animate={overlayOpen ? 'visible' : 'hidden'}
      >
        {navItems.map(({ link }, i) => {
          const resolved = resolveCMSLinkHref(link)
          const active = isActiveNavPath(pathname, resolved)

          return (
            <motion.div
              key={i}
              className="flex items-center justify-center gap-3"
              variants={overlayItem}
            >
              <img
                src="/icons/arrow.svg"
                alt=""
                className="h-5 w-auto shrink-0 sm:h-6"
                aria-hidden
              />
              <CMSLink
                {...link}
                appearance="inline"
                className={mobileOverlayLinkClass(active)}
                onClick={onNavigate}
              />
            </motion.div>
          )
        })}

        <motion.div className="w-full" variants={overlayItem}>
          <LocaleSwitcher
            className="w-full shrink-0 justify-center gap-6 text-2xl font-semibold tracking-[0.2em] text-black sm:text-3xl sm:gap-8"
            onNavigate={onNavigate}
          />
        </motion.div>

        {externalImageLinks.length > 0 ? (
          <motion.div
            className="flex w-full flex-wrap items-center justify-center gap-5 border-t border-black/15 pt-4"
            variants={overlayItem}
          >
            {externalImageLinks.map((row, i) => (
              <ExternalImageLink
                key={`ext-${i}`}
                row={row}
                frameClass="group inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full"
                imageClass=" object-cover transition-transform duration-300 ease-out group-hover:scale-[1.12]"
                onNavigate={onNavigate}
              />
            ))}
          </motion.div>
        ) : null}
      </motion.nav>
    )
  }

  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-y-3 md:gap-y-0">
      <nav
        aria-label="Main"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 md:gap-x-8 lg:gap-x-12"
      >
        {navItems.map(({ link }, i) => {
          const resolved = resolveCMSLinkHref(link)
          const active = isActiveNavPath(pathname, resolved)

          return (
            <div className="flex items-center gap-2" key={i}>
              <img
                src="/icons/arrow.svg"
                alt=""
                className="h-[0.55rem] w-auto shrink-0 md:h-4"
                aria-hidden
              />
              <CMSLink {...link} appearance="inline" className={linkClass(active)} />
            </div>
          )
        })}
      </nav>

      <div className="flex items-center justify-center gap-4">
        <LocaleSwitcher className="shrink-0 gap-3 text-sm font-medium text-black md:pl-2" />
        {externalImageLinks.length > 0 ? (
          <div className="flex items-center gap-5 border-black/15 pl-2 md:pl-6">
            {externalImageLinks.map((row, i) => (
              <ExternalImageLink
                key={`ext-${i}`}
                row={row}
                frameClass="group inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full md:size-16"
                imageClass="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.12]"
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
