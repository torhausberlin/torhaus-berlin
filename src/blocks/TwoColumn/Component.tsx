import React from 'react'

import type { TwoColumnBlock as TwoColumnBlockProps } from '@/payload-types'

import { SectionHeadingBlock } from '@/blocks/SectionHeading/Component'
import { cn } from '@/utilities/ui'

import { TwoColumnCell } from './ColumnContent'

type Props = TwoColumnBlockProps & {
  disableInnerContainer?: boolean
  id?: string
}

export const TwoColumnBlock: React.FC<Props> = ({ id, leftColumn, rightColumn, sectionHeading }) => {
  const headingText = sectionHeading?.heading?.trim()

  return (
    <div className="container" id={id ? `block-${id}` : undefined}>
      {headingText ? (
        <div className="mb-10 md:mb-12">
          <SectionHeadingBlock
            blockType="sectionHeading"
            heading={headingText}
            level={sectionHeading?.level ?? 'h2'}
            unboxed
          />
        </div>
      ) : null}

      <div
        className={cn(
          'grid grid-cols-1 gap-10 md:gap-12',
          'lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0',
          'items-start',
        )}
      >
        <div className="min-w-0 space-y-4">
          <TwoColumnCell column={leftColumn} />
        </div>
        <div className="min-w-0 space-y-4">
          <TwoColumnCell column={rightColumn} />
        </div>
      </div>
    </div>
  )
}
