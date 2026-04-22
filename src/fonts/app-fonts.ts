import localFont from 'next/font/local'

/** Body / UI — Roboto (variable, wdth + wght) */
export const fontRoboto = localFont({
  src: [
    {
      path: '../../public/fonts/Roboto-VariableFont_wdth,wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
})

/** Headings — Neue Machina */
export const fontNeueMachina = localFont({
  src: [
    {
      path: '../../public/fonts/NeueMachina-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueMachina-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueMachina-Ultrabold.otf',
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
