import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import React from 'react'

import { Code } from './Component.client'

export type CodeBlockProps = {
  code: string
  language?: string
  blockType: 'code'
}

type Props = CodeBlockProps & {
  className?: string
} & RevealableBlockProps

export const CodeBlock: React.FC<Props> = ({
  className,
  code,
  isFirstLayoutBlock = true,
  language,
  revealStaggerIndex,
}) => {
  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <div className={[className, 'not-prose'].filter(Boolean).join(' ')}>
        <Code code={code} isFirstLayoutBlock={isFirstLayoutBlock} language={language} />
      </div>
    </BlockScrollReveal>
  )
}
