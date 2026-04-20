import type { Block } from 'payload'

import { richTextField, richTextHeadingNone } from '@/fields/richTextField'

const bannerContent = richTextField('content', false, '', '', '', richTextHeadingNone)

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      ...bannerContent,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
