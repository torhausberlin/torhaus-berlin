import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
  /** When true, image grows with the two-column row (use with viewport height 0 or any). */
  fillHeight?: boolean
} & RevealableBlockProps

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    fillHeight,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    viewportHeightPercent: viewportHeightPercentFromDoc,
    revealStaggerIndex,
  } = props

  const viewportHeightPercent =
    typeof viewportHeightPercentFromDoc === 'number' ? viewportHeightPercentFromDoc : 75

  let caption
  if (media && typeof media === 'object') caption = media.caption

  const useContainer = enableGutter && !disableInnerContainer
  const useViewportHeight = !fillHeight && viewportHeightPercent > 0
  const useMinHeightFallback = !fillHeight && !useViewportHeight

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
    <div className={cn('flex w-full flex-col', fillHeight && 'min-h-0 flex-1', useContainer && 'container', className)}>
      {(media || staticImage) && (
        <div
          className={cn(
            'relative w-full min-h-0 overflow-hidden bg-black',
            fillHeight && 'flex-1 lg:min-h-0',
            useMinHeightFallback && 'min-h-[38dvh] md:min-h-[55vh]',
            useViewportHeight && 'max-md:max-h-[52dvh]',
          )}
          style={
            useViewportHeight ? { height: `${viewportHeightPercent}dvh` } : undefined
          }
        >
          <Media
            className="absolute inset-0 block h-full w-full"
            fill
            imgClassName={cn('object-cover', imgClassName)}
            resource={media}
            size="100vw"
            src={staticImage}
          />
        </div>
      )}
      {caption && (
        <div
          className={cn(
            'border-t-2 border-black bg-white px-6 py-6 md:px-10 md:py-8',
            useContainer && !disableInnerContainer && 'container',
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
    </BlockScrollReveal>
  )
}
