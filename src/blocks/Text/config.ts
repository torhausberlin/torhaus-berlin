import type { Block } from 'payload'

import { richTextField } from '@/fields/richTextField'

export const Text: Block = {
  slug: 'text',
  interfaceName: 'TextBlock',
  fields: [richTextField('content', false, '', '', '')],
  labels: {
    plural: 'Text blocks',
    singular: 'Text',
  },
}
