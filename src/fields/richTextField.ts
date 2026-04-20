import type { Field } from 'payload'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

import { lexicalLinkFeature } from '@/fields/lexicalLinkFeature'

/** Matches Lexical `HeadingTagType` without a direct `@lexical/rich-text` app dependency. */
type LexicalHeadingSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const defaultHeadingSizes: LexicalHeadingSize[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

/** Pass as `enabledHeadingSizes` to omit the heading toolbar (e.g. banner). */
export const richTextHeadingNone: LexicalHeadingSize[] = []

/**
 * Reusable localized rich text (lists, headings, uploads, custom link + anchor fields).
 * Default internal links: **pages** and **posts** (same as `defaultLexical`).
 */
export const richTextField = (
  name: string = 'richText',
  label: boolean = true,
  labelDE: string,
  labelEN: string,
  adminDescription: string = '',
  enabledHeadingSizes: LexicalHeadingSize[] = defaultHeadingSizes,
  linkRelationTo: Array<'pages' | 'posts'> = ['pages', 'posts'],
): Field => ({
  name,
  localized: true,
  type: 'richText',
  label: label
    ? {
        de: labelDE,
        en: labelEN,
      }
    : false,
  admin: {
    description: adminDescription,
  },
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      const features = [...rootFeatures]
      if (enabledHeadingSizes.length > 0) {
        features.push(HeadingFeature({ enabledHeadingSizes }))
      }
      features.push(
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        lexicalLinkFeature(linkRelationTo),
        UploadFeature({ enabledCollections: ['media'] }),
      )
      return features
    },
  }),
})
