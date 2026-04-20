import type { Block } from 'payload'

import { richTextField } from '@/fields/richTextField'

import { linkGroup } from '@/fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    richTextField('richText', false, '', '', '', ['h1', 'h2', 'h3', 'h4']),
    linkGroup({
      appearances: ['default', 'outline'],
      localized: true,
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
