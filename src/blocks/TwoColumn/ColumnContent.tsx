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

  if (isColumnText(block)) {
    if (!block.content) return null
    return <RichText className="mb-0" data={block.content} enableGutter={false} />
  }

  if (isColumnSlideshow(block)) {
    return <SlideshowBlock blockType="slideshow" gallery={block.gallery} unboxed />
  }

  if (isColumnMedia(block)) {
    return <MediaBlock blockType="mediaBlock" enableGutter={false} media={block.media} />
  }

  return null
}
