'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState, useSyncExternalStore } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

function subscribe() {
  return () => {}
}

function getThemePreference(): string {
  return window.localStorage.getItem(themeLocalStorageKey) ?? 'auto'
}

function getServerThemePreference(): string {
  return 'auto'
}

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const storedPreference = useSyncExternalStore(
    subscribe,
    getThemePreference,
    getServerThemePreference,
  )
  const [value, setValue] = useState<string | null>(null)
  const selectValue = value ?? storedPreference

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  return (
    <Select onValueChange={onThemeChange} value={selectValue}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}
