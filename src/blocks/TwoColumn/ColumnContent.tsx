import React from 'react'

import type {
  TwoColumnBlock,
  TwoColumnColumnMedia,
  TwoColumnColumnSlideshow,
  TwoColumnColumnText,
} from '@/payload-types'

import RichText from '@/components/RichText'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SlideshowBlock } from '@/blocks/Slideshow/Component'
import { cn } from '@/utilities/ui'

type ColumnBlock = NonNullable<TwoColumnBlock['leftColumn']>[number]

function isColumnText(block: ColumnBlock): block is TwoColumnColumnText {
  return block.blockType === 'columnText'
}

function isColumnSlideshow(block: ColumnBlock): block is TwoColumnColumnSlideshow {
  return block.blockType === 'columnSlideshow'
}

function isColumnMedia(block: ColumnBlock): block is TwoColumnColumnMedia {
  return block.blockType === 'columnMedia'
}

export const TwoColumnCell: React.FC<{
  column: TwoColumnBlock['leftColumn'] | TwoColumnBlock['rightColumn']
}> = ({ column }) => {
  const block = column?.[0]

  if (!block) {
    return null
  }

  const growMedia =
    block.blockType === 'columnSlideshow' || block.blockType === 'columnMedia'

  const inner =
    isColumnText(block) && block.content ? (
      <RichText className="mb-0" data={block.content} enableGutter={false} />
    ) : isColumnSlideshow(block) ? (
      <SlideshowBlock blockType="slideshow" gallery={block.gallery} unboxed />
    ) : isColumnMedia(block) ? (
      <MediaBlock
        blockType="mediaBlock"
        display={block.display}
        disableInnerContainer
        enableGutter={false}
        fillHeight
        media={block.media}
      />
    ) : null

  if (!inner) return null

  return <div className={cn('min-w-0', growMedia && 'flex min-h-0 flex-1 flex-col')}>{inner}</div>
}
