'use client'

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

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const externalImageLinks = data?.externalImageLinks || []

  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-y-3  md:gap-y-0">
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
              <CMSLink
                {...link}
                appearance="inline"
                className={cn(
                  'font-sans text-sm font-medium tracking-tight text-black  transition-opacity hover:opacity-70 md:text-lg',
                  active ? 'underline underline-offset-4' : 'underline-transparent',
                )}
              />
            </div>
          )
        })}
      </nav>

      <div className="flex items-center gap-4 justify-center ">
        <LocaleSwitcher className="shrink-0 gap-3 text-sm font-medium text-black md:pl-2" />
        {externalImageLinks.length > 0 ? (
          <div className="flex items-center gap-3 border-black/15 pl-2 md:pl-6">
            {externalImageLinks.map((row, i) => {
              const { image, openInNewTab, url } = row
              if (!url || !image || typeof image !== 'object') return null
              const rel = openInNewTab !== false ? 'noopener noreferrer' : undefined
              const target = openInNewTab !== false ? '_blank' : undefined
              const frameClass =
                'group inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full md:size-16'
              const imageClass =
                'size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.12]'

              if (!isValidExternalUrl(url)) {
                return (
                  <span className={frameClass} key={`ext-${i}`} title={url}>
                    <Media imgClassName={imageClass} resource={image} />
                  </span>
                )
              }

              return (
                <a className={frameClass} href={url} key={`ext-${i}`} rel={rel} target={target}>
                  <Media imgClassName={imageClass} resource={image} />
                </a>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
