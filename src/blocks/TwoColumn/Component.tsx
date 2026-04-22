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

function columnHasSlideshow(
  column: TwoColumnBlockProps['leftColumn'] | TwoColumnBlockProps['rightColumn'],
) {
  return column?.[0]?.blockType === 'columnSlideshow'
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
  const leftHasSlideshow = columnHasSlideshow(leftColumn)
  const rightHasSlideshow = columnHasSlideshow(rightColumn)
  /** Mobile stack: show slideshow in the second (bottom) slot. DOM is left then right, so we only need to swap when the slideshow is in the left column. */
  const mobileStackSlideshowLast = leftHasSlideshow && !rightHasSlideshow

  /** Match Text block: `container` horizontal padding + `sectionPy` vertical (see globals.css). */
  const textCellPadding =
    'bg-white px-4 md:px-8 sectionPy lg:justify-center lg:px-14 lg:py-24 xl:px-20 xl:py-28'

  const textCellWhenMedia = textCellPadding

  const leftCellClassName = cn(
    'flex min-h-0 flex-col border-black lg:h-full lg:min-h-0',
    !hasImageOrSlideshow && 'md:min-h-[45vh] lg:min-h-0',
    // Stacked border sits under the *visually* first row (order may swap below lg).
    mobileStackSlideshowLast ? 'max-lg:border-b-0' : 'border-b-2',
    'lg:border-b-0 lg:border-r-2',
    mobileStackSlideshowLast && 'max-lg:order-2',
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
    mobileStackSlideshowLast && 'max-lg:order-1 max-lg:border-b-2',
  )

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <div className="w-full" id={id ? `block-${id}` : undefined}>
        {headingText ? (
          <div className="w-full border-b-2 border-black">
            <div className="container py-6 text-center tracking-widest lg:py-12">
              <SectionHeadingBlock
                unboxed
                blockType="sectionHeading"
                heading={headingText}
                level={sectionHeading?.level ?? 'h2'}
              />
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            'grid w-full grid-cols-1 border-black lg:grid-cols-2 lg:items-stretch',
            hasImageOrSlideshow
              ? 'min-h-0 lg:min-h-[80vh] lg:grid-rows-[minmax(80vh,auto)]'
              : 'md:min-h-[50vh] lg:min-h-[60vh]',
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
