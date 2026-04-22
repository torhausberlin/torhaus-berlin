import React from 'react'

import { cn } from '@/utilities/ui'

import type { SectionHeadingBlock as SectionHeadingBlockProps } from '@/payload-types'
import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'

const levelClass: Record<'h2' | 'h3' | 'h4', string> = {
  h2: 'text-3xl md:text-5xl font-semibold font-heading',
  h3: 'text-2xl md:text-3xl font-semibold font-heading',
  h4: 'text-xl md:text-2xl font-semibold font-heading',
}

type Props = SectionHeadingBlockProps & {
  disableInnerContainer?: boolean
  /** When true, omit the outer `container` wrapper (e.g. nested inside Two column). */
  unboxed?: boolean
} & RevealableBlockProps

export const SectionHeadingBlock: React.FC<Props> = ({
  heading,
  level,
  unboxed,
  revealStaggerIndex,
}) => {
  if (!heading) return null

  const tag: 'h2' | 'h3' | 'h4' = ['h2', 'h3', 'h4'].includes(level ?? '')
    ? (level as 'h2' | 'h3' | 'h4')
    : 'h2'

  const headingEl = React.createElement(
    tag,
    { className: cn('text-foreground', levelClass[tag]) },
    heading,
  )

  if (unboxed) {
    return (
      <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>{headingEl}</BlockScrollReveal>
    )
  }

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <div className="container py-6 lg:py-12 text-center tracking-widest">{headingEl}</div>
    </BlockScrollReveal>
  )
}
