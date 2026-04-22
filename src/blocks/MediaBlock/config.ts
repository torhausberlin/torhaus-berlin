import type { Block } from 'payload'

import { mediaBlockDisplayField } from './displayField'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    mediaBlockDisplayField,
    {
      name: 'viewportHeightPercent',
      type: 'number',
      label: 'Image height (% of viewport height)',
      defaultValue: 75,
      min: 0,
      max: 100,
      admin: {
        description: 'Use 0 for auto / fill-height (e.g. inside two-column layouts).',
      },
    },
  ],
}
