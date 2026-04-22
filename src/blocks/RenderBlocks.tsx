import React from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { ContentBlock } from '@/blocks/Content/Component'
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
  revealStaggerIndex: number
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <div className="w-full divide-y-2 divide-black  ">
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const BlockComponent = Block as React.ComponentType<BlockWithLayoutProps>
              return (
                <BlockComponent
                  key={index}
                  {...block}
                  disableInnerContainer
                  revealStaggerIndex={index}
                />
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
