import localFont from 'next/font/local'

/** Body / UI — Rubik (variable) */
export const fontRubik = localFont({
  src: [
    {
      path: '../../public/fonts/Rubik-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Rubik-Italic-VariableFont_wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-rubik',
  display: 'swap',
})

/** Headings — Neue Machina */
export const fontNeueMachina = localFont({
  src: [
    {
      path: '../../public/fonts/NeueMachina-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueMachina-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueMachina-Ultrabold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-neue-machina',
  display: 'swap',
})

/** Monospace — Roboto Mono (variable) */
export const fontRobotoMono = localFont({
  src: '../../public/fonts/RobotoMono-VariableFont_wght.ttf',
  variable: '--font-roboto-mono',
  display: 'swap',
})
