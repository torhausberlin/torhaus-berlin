import React from 'react'

import type { Page } from '@/payload-types'
import { cn } from '@/utilities/ui'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { EventListingBlock } from '@/blocks/EventListing/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProjectsListingBlock } from '@/blocks/ProjectsListing/Component'
import { SectionHeadingBlock } from '@/blocks/SectionHeading/Component'
import { SlideshowBlock } from '@/blocks/Slideshow/Component'
import { TextBlock } from '@/blocks/Text/Component'
import { TwoColumnBlock } from '@/blocks/TwoColumn/Component'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  code: CodeBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  eventListing: EventListingBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  projectsListing: ProjectsListingBlock,
  sectionHeading: SectionHeadingBlock,
  slideshow: SlideshowBlock,
  text: TextBlock,
  twoColumn: TwoColumnBlock,
}

/** Layout-only props passed from RenderBlocks; not in CMS payload types. */
type BlockWithLayoutProps = Page['layout'][0] & {
  disableInnerContainer?: boolean
  isFirstLayoutBlock: boolean
  revealStaggerIndex: number
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    let layoutBlockIndex = 0

    const isVisibleOnMobile = (block: Page['layout'][0]) =>
      block.blockType === 'mediaBlock' ? block.display !== 'desktop' : true

    const isVisibleOnDesktop = (block: Page['layout'][0]) =>
      block.blockType === 'mediaBlock' ? block.display !== 'mobile' : true

    return (
      <div className="w-full">
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const BlockComponent = Block as React.ComponentType<BlockWithLayoutProps>
              const isFirstLayoutBlock = layoutBlockIndex === 0
              const hasVisibleAfterMobile = blocks
                .slice(index + 1)
                .some((nextBlock) => isVisibleOnMobile(nextBlock))
              const hasVisibleAfterDesktop = blocks
                .slice(index + 1)
                .some((nextBlock) => isVisibleOnDesktop(nextBlock))
              layoutBlockIndex += 1

              const mediaVisibilityClassName =
                blockType === 'mediaBlock'
                  ? block.display === 'desktop'
                    ? 'max-lg:hidden'
                    : block.display === 'mobile'
                      ? 'lg:hidden'
                      : undefined
                  : undefined

              return (
                <div
                  key={index}
                  className={cn(
                    'w-full',
                    mediaVisibilityClassName,
                    hasVisibleAfterMobile && 'max-lg:border-b-[3px] max-lg:border-b-black',
                    hasVisibleAfterDesktop && 'lg:border-b-[3px] lg:border-b-black',
                  )}
                >
                  <BlockComponent
                    {...block}
                    disableInnerContainer
                    isFirstLayoutBlock={isFirstLayoutBlock}
                    revealStaggerIndex={index}
                  />
                </div>
              )
            }
          }
          return null
        })}
      </div>
    )
  }

  return null
}
