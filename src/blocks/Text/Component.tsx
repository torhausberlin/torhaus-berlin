import React from 'react'

import type { TextBlock as TextBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'

type Props = TextBlockProps & {
  disableInnerContainer?: boolean
}

export const TextBlock: React.FC<Props> = ({ content }) => {
  if (!content) return null

  return (
    <div className="container max-w-[48rem]">
      <RichText className="mb-0" data={content} enableGutter={false} />
    </div>
  )
}
