'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({
  children,
  lightOnly = false,
}: {
  children: React.ReactNode
  lightOnly?: boolean
}) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback(
    (themeToSet: Theme | null) => {
      if (lightOnly) {
        document.documentElement.setAttribute('data-theme', 'light')
        setThemeState('light')
        return
      }
      if (themeToSet === null) {
        window.localStorage.removeItem(themeLocalStorageKey)
        const implicitPreference = getImplicitPreference()
        document.documentElement.setAttribute('data-theme', implicitPreference || '')
        if (implicitPreference) setThemeState(implicitPreference)
      } else {
        setThemeState(themeToSet)
        window.localStorage.setItem(themeLocalStorageKey, themeToSet)
        document.documentElement.setAttribute('data-theme', themeToSet)
      }
    },
    [lightOnly],
  )

  useEffect(() => {
    if (lightOnly) {
      window.localStorage.removeItem(themeLocalStorageKey)
      document.documentElement.setAttribute('data-theme', 'light')
      setThemeState('light')
      return
    }

    let themeToSet: Theme = defaultTheme
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [lightOnly])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
