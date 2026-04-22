import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import { mediaBlockDisplayClassName } from '@/blocks/MediaBlock/displayClasses'
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
    display: displayFromProps,
    enableGutter = true,
    fillHeight,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    viewportHeightPercent: viewportHeightPercentFromDoc,
    revealStaggerIndex,
  } = props

  const display = displayFromProps ?? 'all'

  const viewportHeightPercent =
    typeof viewportHeightPercentFromDoc === 'number' ? viewportHeightPercentFromDoc : 75

  let caption
  if (media && typeof media === 'object') caption = media.caption

  const useContainer = enableGutter && !disableInnerContainer
  const useViewportHeight = !fillHeight && viewportHeightPercent > 0
  const useMinHeightFallback = !fillHeight && !useViewportHeight

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
    <div
      className={cn(
        'flex w-full flex-col',
        fillHeight && 'min-h-0 flex-1',
        useContainer && 'container',
        mediaBlockDisplayClassName(display),
        className,
      )}
    >
      {(media || staticImage) && (
        <div
          className={cn(
            'relative w-full min-h-0 overflow-hidden bg-black',
            // fillHeight: row height comes from the grid on lg+; on mobile the stack has no
            // intrinsic height, so flex-1 alone collapses to 0 — add a svh floor until lg.
            fillHeight && 'min-h-[38svh] flex-1 md:min-h-[45svh] lg:min-h-0',
            useMinHeightFallback && 'min-h-[38svh] md:min-h-[55vh]',
            useViewportHeight && 'max-md:max-h-[52svh]',
          )}
          style={
            useViewportHeight ? { height: `${viewportHeightPercent}svh` } : undefined
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
