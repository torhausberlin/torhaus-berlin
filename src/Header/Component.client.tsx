'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setIsMobileMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={cn(
        'z-50 flex w-full flex-col text-black',
        'max-lg:pointer-events-none max-lg:fixed max-lg:inset-0',
        'lg:relative lg:inset-auto lg:pointer-events-auto',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="relative shrink-0 bg-torhaus-yellow">
        <div className="pointer-events-auto border-b border-black">
          <div className="container flex items-center gap-4 py-3 md:gap-16 md:py-4">
            <Link
              className="relative size-11 shrink-0 rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-black md:size-20"
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Logo loading="eager" priority="high" />
            </Link>

            <div className="hidden min-w-0 flex-1 lg:block">
              <HeaderNav data={data} variant="desktop" />
            </div>

            <button
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center  text-black lg:hidden"
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span className="sr-only">Open menu</span>
              <span className="relative h-4 w-5">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-300',
                    isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : '',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[7px] h-0.5 w-full bg-current transition-opacity duration-300',
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[14px] h-0.5 w-full bg-current transition-transform duration-300',
                    isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : '',
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'absolute left-0 right-0 top-full z-40 border-b border-black bg-torhaus-yellow shadow-md transition-[max-height] duration-300 ease-in-out lg:hidden',
            isMobileMenuOpen
              ? 'pointer-events-auto max-h-[min(calc(100svh-0.75rem-2.75rem-0.75rem-1px),48rem)] md:max-h-[min(calc(100svh-1rem-5rem-1rem-1px),48rem)] overflow-y-auto'
              : 'pointer-events-none max-h-0 overflow-hidden',
          )}
        >
          <div className="container py-7">
            <HeaderNav
              data={data}
              variant="mobile"
              overlayOpen={isMobileMenuOpen}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
