import React from 'react'

import type { TwoColumnBlock as TwoColumnBlockProps } from '@/payload-types'

import { SectionHeadingBlock } from '@/blocks/SectionHeading/Component'
import { cn } from '@/utilities/ui'

import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import { TwoColumnCell } from './ColumnContent'

type Props = TwoColumnBlockProps & {
  disableInnerContainer?: boolean
  id?: string
} & RevealableBlockProps

function columnHasImageOrSlideshow(
  column: TwoColumnBlockProps['leftColumn'] | TwoColumnBlockProps['rightColumn'],
) {
  const block = column?.[0]
  return block?.blockType === 'columnSlideshow' || block?.blockType === 'columnMedia'
}

export const TwoColumnBlock: React.FC<Props> = ({
  id,
  leftColumn,
  revealStaggerIndex,
  rightColumn,
  sectionHeading,
}) => {
  const headingText = sectionHeading?.heading?.trim()
  const hasImageOrSlideshow =
    columnHasImageOrSlideshow(leftColumn) || columnHasImageOrSlideshow(rightColumn)

  const leftHasMedia = columnHasImageOrSlideshow(leftColumn)
  const rightHasMedia = columnHasImageOrSlideshow(rightColumn)

  /** Match Text block: `container` horizontal padding + `sectionPy` vertical (see globals.css). */
  const textCellPadding =
    'bg-white px-4 md:px-8 sectionPy lg:justify-center lg:px-14 lg:py-24 xl:px-20 xl:py-28'

  const textCellWhenMedia = textCellPadding

  const leftCellClassName = cn(
    'flex min-h-0 flex-col border-black lg:h-full lg:min-h-0',
    !hasImageOrSlideshow && 'md:min-h-[45vh] lg:min-h-0',
    'border-b-2 lg:border-b-0 lg:border-r-2',
    !hasImageOrSlideshow && textCellPadding,
    hasImageOrSlideshow && (leftHasMedia ? undefined : textCellWhenMedia),
  )

  const rightCellClassName = cn(
    'flex min-h-0 flex-col border-black lg:h-full lg:min-h-0',
    hasImageOrSlideshow
      ? rightHasMedia
        ? undefined
        : textCellWhenMedia
      : textCellPadding,
  )

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <div className="w-full" id={id ? `block-${id}` : undefined}>
        {headingText ? (
          <SectionHeadingBlock
            blockType="sectionHeading"
            heading={headingText}
            level={sectionHeading?.level ?? 'h2'}
          />
        ) : null}

        <div
          className={cn(
            'grid w-full grid-cols-1 border-black lg:grid-cols-2 lg:items-stretch',
            hasImageOrSlideshow
              ? 'min-h-0 lg:min-h-[80vh] lg:grid-rows-[minmax(80vh,auto)]'
              : 'md:min-h-[50vh] lg:min-h-[60vh]',
            headingText ? 'border-t-2 border-black' : '',
          )}
        >
          <div className={leftCellClassName}>
            <TwoColumnCell column={leftColumn} />
          </div>
          <div className={rightCellClassName}>
            <TwoColumnCell column={rightColumn} />
          </div>
        </div>
      </div>
    </BlockScrollReveal>
  )
}
