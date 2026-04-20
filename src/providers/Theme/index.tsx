'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import { themeLocalStorageKey } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: 'light',
}

const ThemeContext = createContext(initialContext)

/** Frontend is light-only: `data-theme` stays `light`, legacy theme key cleared from storage. */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  const setTheme = useCallback((_next: Theme | null) => {
    document.documentElement.setAttribute('data-theme', 'light')
    setThemeState('light')
  }, [])

  useEffect(() => {
    try {
      window.localStorage.removeItem(themeLocalStorageKey)
    } catch {
      // ignore private mode / access errors
    }
    document.documentElement.setAttribute('data-theme', 'light')
    setThemeState('light')
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
