import React from 'react'

import type { TextBlock as TextBlockProps } from '@/payload-types'

import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import RichText from '@/components/RichText'

type Props = TextBlockProps & {
  disableInnerContainer?: boolean
} & RevealableBlockProps

export const TextBlock: React.FC<Props> = ({ content, revealStaggerIndex }) => {
  if (!content) return null

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <div className="container max-w-3xl sectionPy">
        <RichText className="mb-0" data={content} enableGutter={false} />
      </div>
    </BlockScrollReveal>
  )
}
