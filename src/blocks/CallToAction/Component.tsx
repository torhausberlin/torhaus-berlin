import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CTABlockProps & RevealableBlockProps> = ({
  isFirstLayoutBlock = true,
  links,
  richText,
  revealStaggerIndex,
}) => {
  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
    <div className="w-full">
      <div
        className={cn(
          'flex flex-col gap-8 border-[3px] border-black bg-card p-6 md:flex-row md:items-center md:justify-between md:p-10',
          !isFirstLayoutBlock && 'border-t-0',
        )}
      >
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
    </BlockScrollReveal>
  )
}
