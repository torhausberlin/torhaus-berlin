'use client'

import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { CMSLink, resolveCMSLinkHref } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import { isActiveNavPath } from '@/utilities/isActiveNavPath'
import { cn } from '@/utilities/ui'

type Props = {
  data: FooterType
}

export const FooterClient: React.FC<Props> = ({ data }) => {
  const pathname = usePathname()
  const navItems = data?.navItems || []

  return (
    <footer className="mt-auto border-t-2 border-black bg-torhaus-yellow text-black">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:items-center md:justify-between">
        <Link className="flex shrink-0 items-center relative size-11 md:size-14" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <nav aria-label="Footer" className="flex flex-col gap-4 md:flex-row md:gap-8">
            {navItems.map(({ link }, i) => {
              const resolved = resolveCMSLinkHref(link)
              const active = isActiveNavPath(pathname, resolved)

              return (
                <CMSLink
                  {...link}
                  appearance="inline"
                  className={cn(
                    'font-sans text-sm font-medium tracking-tight text-black transition-opacity hover:opacity-70 md:text-lg',
                    active ? 'underline underline-offset-4' : 'underline-transparent',
                  )}
                  key={i}
                />
              )
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
