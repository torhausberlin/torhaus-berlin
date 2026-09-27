import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  SerializedAutoLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { Link } from '@/i18n/navigation'
import { buildLinkRel, isNonAppHref } from '@/utilities/linkResolver'
import { cn } from '@/utilities/ui'
import type { ReactNode } from 'react'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = typeof value.slug === 'string' ? value.slug : ''
  if (relationTo === 'posts') return `/posts/${slug}`
  if (slug === 'home') return '/'
  return `/${slug}`
}

function withSectionHash(href: string, fields: SerializedLinkNode['fields']): string {
  const sectionId = typeof fields.sectionId === 'string' ? fields.sectionId.replace(/^#/, '') : ''
  if (!fields.isAnchorLink || !sectionId) return href
  if (href.includes('#')) return href
  if (href === '/' || href === '') return `#${sectionId}`
  return `${href}#${sectionId}`
}

function RichTextAnchor({
  href,
  newTab,
  children,
}: {
  href: string
  newTab?: boolean | null
  children: ReactNode
}) {
  const rel = buildLinkRel({ url: href, newTab })
  const relProps = rel ? { rel } : {}
  const newTabProps = newTab ? { target: '_blank' as const } : {}

  if (href.startsWith('#') || isNonAppHref(href)) {
    return (
      <a href={href} {...newTabProps} {...relProps}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...newTabProps} {...relProps}>
      {children}
    </Link>
  )
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const href = (node as SerializedAutoLinkNode).fields.url ?? ''
    return (
      <RichTextAnchor href={href} newTab={(node as SerializedAutoLinkNode).fields.newTab}>
        {children}
      </RichTextAnchor>
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const fields = node.fields
    let href = fields.url ?? ''
    if (fields.linkType === 'internal') {
      href = internalDocToHref({ linkNode: node })
    }
    href = withSectionHash(href, fields)
    return (
      <RichTextAnchor href={href} newTab={fields.newTab}>
        {children}
      </RichTextAnchor>
    )
  },
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert prose-p:text-base prose-p:font-medium prose-p:leading-snug md:prose-p:text-xl prose-li:text-base prose-li:font-medium prose-li:text-black prose-li:marker:text-black prose-li:leading-snug md:prose-li:text-xl':
            enableProse,
          '[&_p]:text-base [&_p]:font-medium md:[&_p]:text-xl [&_p]:leading-snug [&_li]:text-base [&_li]:font-medium [&_li]:text-black [&_li]:marker:text-black md:[&_li]:text-xl [&_li]:leading-snug':
            !enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
