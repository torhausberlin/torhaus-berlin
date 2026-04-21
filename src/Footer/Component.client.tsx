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
      <div className="container flex max-w-full flex-col gap-5 py-4 md:flex-row md:items-center md:justify-between md:gap-12">
        <Link
          className="relative size-12 shrink-0 items-center md:size-20 hidden md:block"
          href="/"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Footer"
          className="flex w-full min-w-0 flex-col gap-0 md:w-auto md:flex-row md:items-center md:gap-8 lg:gap-10"
        >
          {navItems.map(({ link }, i) => {
            const resolved = resolveCMSLinkHref(link)
            const active = isActiveNavPath(pathname, resolved)

            return (
              <CMSLink
                {...link}
                appearance="inline"
                className={cn(
                  'inline-flex min-h-11 w-full shrink-0 items-center rounded-sm px-0.5 py-1.5 font-sans text-base font-medium leading-snug tracking-tight text-black transition-[opacity,background-color] hover:opacity-70 active:bg-black/5 md:min-h-0 md:w-auto md:py-0 md:text-lg md:active:bg-transparent',
                  active ? 'underline underline-offset-4' : 'underline-transparent',
                )}
                key={i}
              />
            )
          })}
        </nav>
      </div>
    </footer>
  )
}
