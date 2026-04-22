'use client'

import type { SlideshowBlock as SlideshowBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import React, { useCallback, useEffect, useState } from 'react'

type Props = SlideshowBlockProps & {
  disableInnerContainer?: boolean
  id?: string
  /** When true, fill the parent (e.g. two-column); sharp edges, object-cover. */
  unboxed?: boolean
} & RevealableBlockProps

export const SlideshowBlock: React.FC<Props> = ({
  disableInnerContainer,
  gallery,
  id,
  revealStaggerIndex,
  unboxed,
}) => {
  const slides =
    gallery
      ?.map((row) => row.image)
      .filter((img): img is NonNullable<typeof img> => Boolean(img && typeof img === 'object')) ??
    []

  const [index, setIndex] = useState(0)

  const count = slides.length

  const go = useCallback(
    (dir: -1 | 1) => {
      if (count === 0) return
      setIndex((i) => (i + dir + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0)
  }, [count, index])

  if (count === 0) return null

  const current = slides[index]

  const inner = (
    <div
      className={cn(
        'relative w-full min-h-0 overflow-hidden bg-black',
        // Unboxed (two column): 65svh mobile, 90svh desktop; flex fills parent from lg up.
        unboxed
          ? 'min-h-[65svh] flex-1 lg:min-h-[90svh]'
          : 'aspect-video md:aspect-21/9 min-h-[65svh] lg:min-h-[90svh]',
      )}
    >
      <Media
        className="absolute inset-0 block h-full w-full"
        fill
        imgClassName="object-cover"
        priority={index === 0}
        resource={current}
        size="100vw"
      />

      {count > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/50 to-transparent" />
          <Button
            aria-label="Previous slide"
            className="group absolute left-2 top-1/2 z-10 size-11 min-h-11 min-w-11 -translate-y-1/2 border-2 border-white bg-black text-white transition-[background-color,box-shadow,border-color] hover:cursor-pointer hover:border-white/90 hover:bg-neutral-900 hover:shadow-md hover:shadow-black/40 hover:text-white focus-visible:text-white"
            onClick={() => go(-1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeft
              className="size-6 text-white transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden
            />
          </Button>
          <Button
            aria-label="Next slide"
            className="group absolute right-2 top-1/2 z-10 size-11 min-h-11 min-w-11 -translate-y-1/2 border-2 border-white bg-black text-white transition-[background-color,box-shadow,border-color] hover:cursor-pointer hover:border-white/90 hover:bg-neutral-900 hover:shadow-md hover:shadow-black/40 hover:text-white focus-visible:text-white"
            onClick={() => go(1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronRight
              className="size-6 text-white transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Button>
          <div
            aria-live="polite"
            className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5"
          >
            {slides.map((_, i) => (
              <button
                aria-current={i === index ? 'true' : undefined}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'size-2 border border-white transition-colors',
                  i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70',
                )}
                key={i}
                onClick={() => setIndex(i)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )

  if (unboxed) {
    return (
      <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
        <div className="flex min-h-0 w-full flex-1 flex-col">{inner}</div>
      </BlockScrollReveal>
    )
  }

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <div
        className={cn('w-full', !disableInnerContainer && 'container')}
        id={id ? `block-${id}` : undefined}
      >
        {inner}
      </div>
    </BlockScrollReveal>
  )
}
