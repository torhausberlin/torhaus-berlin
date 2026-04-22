'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import { cn } from '@/utilities/ui'
import { CopyButton } from './CopyButton'

type Props = {
  code: string
  isFirstLayoutBlock?: boolean
  language?: string
}

export const Code: React.FC<Props> = ({ code, isFirstLayoutBlock = true, language = '' }) => {
  if (!code) return null

  return (
    <Highlight code={code} language={language} theme={themes.vsDark}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre
          className={cn(
            'overflow-x-auto border-[3px] border-border bg-black p-4 text-xs',
            !isFirstLayoutBlock && 'border-t-0',
          )}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ className: 'table-row', line })}>
              <span className="table-cell select-none text-right text-white/25">{i + 1}</span>
              <span className="table-cell pl-4">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
          <CopyButton code={code} />
        </pre>
      )}
    </Highlight>
  )
}
