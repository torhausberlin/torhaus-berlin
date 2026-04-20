import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

/** Always light; ignores OS preference and localStorage (frontend light-only mode). */
const lightOnlyThemeInitSource = `
(function () {
  document.documentElement.setAttribute('data-theme', 'light')
})();
`.trim()

const themeInitSource = `
(function () {
  function getImplicitPreference() {
    var mediaQuery = '(prefers-color-scheme: dark)'
    var mql = window.matchMedia(mediaQuery)
    var hasImplicitPreference = typeof mql.matches === 'boolean'

    if (hasImplicitPreference) {
      return mql.matches ? 'dark' : 'light'
    }

    return null
  }

  function themeIsValid(theme) {
    return theme === 'light' || theme === 'dark'
  }

  var themeToSet = '${defaultTheme}'
  var preference = window.localStorage.getItem('${themeLocalStorageKey}')

  if (themeIsValid(preference)) {
    themeToSet = preference
  } else {
    var implicitPreference = getImplicitPreference()

    if (implicitPreference) {
      themeToSet = implicitPreference
    }
  }

  document.documentElement.setAttribute('data-theme', themeToSet)
})();
`.trim()

/**
 * Blocking theme script in <head>. React 19 expects inline scripts as text
 * {@link https://react.dev/reference/react-dom/components/script children}, not
 * `dangerouslySetInnerHTML`, so the browser runs them during initial parse.
 */
export const InitTheme: React.FC<{ lightOnly?: boolean }> = ({ lightOnly }) => {
  return (
    <script id="theme-script" suppressHydrationWarning>
      {lightOnly ? lightOnlyThemeInitSource : themeInitSource}
    </script>
  )
}
