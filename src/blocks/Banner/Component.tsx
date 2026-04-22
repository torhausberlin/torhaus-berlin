import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps &
  RevealableBlockProps

export const BannerBlock: React.FC<Props> = ({
  className,
  content,
  isFirstLayoutBlock = true,
  style,
  revealStaggerIndex,
}) => {
  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'flex items-center border-[3px] border-black px-6 py-3',
          !isFirstLayoutBlock && 'border-t-0',
          {
            'border-border bg-card': style === 'info',
            'border-error bg-error/30': style === 'error',
            'border-success bg-success/30': style === 'success',
            'border-warning bg-warning/30': style === 'warning',
          },
        )}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
    </BlockScrollReveal>
  )
}
