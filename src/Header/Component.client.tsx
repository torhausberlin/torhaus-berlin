'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="relative z-20 w-full border-b border-black bg-torhaus-yellow text-black"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container flex items-center gap-4 py-3 md:gap-16 md:py-4">
        <Link
          className="shrink-0 rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-black relative size-11 md:size-20"
          href="/"
        >
          <Logo loading="eager" priority="high" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
