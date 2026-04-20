import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
  lightOnly?: boolean
}> = ({ children, lightOnly }) => {
  return (
    <ThemeProvider lightOnly={lightOnly}>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
