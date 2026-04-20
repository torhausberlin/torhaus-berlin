/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif',
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
              h2: {
                fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif',
              },
              h3: {
                fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif',
              },
              h4: {
                fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif',
              },
              h5: {
                fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif',
              },
              h6: {
                fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
