import React from 'react'

import { cn } from '@/utilities/ui'

import type { SectionHeadingBlock as SectionHeadingBlockProps } from '@/payload-types'

const levelClass: Record<'h2' | 'h3' | 'h4', string> = {
  h2: 'text-3xl md:text-4xl font-semibold tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold tracking-tight',
  h4: 'text-xl md:text-2xl font-semibold tracking-tight',
}

type Props = SectionHeadingBlockProps & {
  disableInnerContainer?: boolean
  /** When true, omit the outer `container` wrapper (e.g. nested inside Two column). */
  unboxed?: boolean
}

export const SectionHeadingBlock: React.FC<Props> = ({ heading, level, unboxed }) => {
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
    return headingEl
  }

  return <div className="container">{headingEl}</div>
}
