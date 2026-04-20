'use client'

import type { SlideshowBlock as SlideshowBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

type Props = SlideshowBlockProps & {
  disableInnerContainer?: boolean
  id?: string
  /** When true, fill the parent (e.g. two-column); sharp edges, object-cover. */
  unboxed?: boolean
}

export const SlideshowBlock: React.FC<Props> = ({
  disableInnerContainer,
  gallery,
  id,
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
        unboxed ? 'flex-1' : 'aspect-video md:aspect-21/9',
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
            className="absolute left-2 top-1/2 z-10 size-10 -translate-y-1/2 border-2 border-white bg-black text-white hover:bg-neutral-900 hover:cursor-pointer"
            onClick={() => go(-1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-10 size-10 -translate-y-1/2 border-2 border-white bg-black text-white hover:bg-neutral-900 hover:cursor-pointer"
            onClick={() => go(1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="size-6" />
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
    return <div className="flex min-h-0 w-full flex-1 flex-col">{inner}</div>
  }

  return (
    <div
      className={cn('w-full', !disableInnerContainer && 'container')}
      id={id ? `block-${id}` : undefined}
    >
      {inner}
    </div>
  )
}
