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
  /** When true, omit the outer `container` wrapper (e.g. inside a column). */
  unboxed?: boolean
}

export const SlideshowBlock: React.FC<Props> = ({ gallery, id, unboxed }) => {
  const slides =
    gallery
      ?.map((row) => row.image)
      .filter((img): img is NonNullable<typeof img> => Boolean(img && typeof img === 'object')) ?? []

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
    <div className="relative overflow-hidden rounded-[0.8rem] border border-border bg-muted/30 aspect-[16/9] md:aspect-[21/9]">
      <Media
        className="relative block h-full w-full"
        fill
        imgClassName="object-contain"
        priority={index === 0}
        resource={current}
      />

      {count > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          <Button
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 text-white shadow-md backdrop-blur-sm hover:bg-black/60"
            onClick={() => go(-1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 text-white shadow-md backdrop-blur-sm hover:bg-black/60"
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
                  'size-2 rounded-full transition-colors',
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
    return inner
  }

  return (
    <div className="container" id={id ? `block-${id}` : undefined}>
      {inner}
    </div>
  )
}
