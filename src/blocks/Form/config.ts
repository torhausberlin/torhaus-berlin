import type { Block } from 'payload'

import { richTextField } from '@/fields/richTextField'

const introContentField = richTextField(
  'introContent',
  true,
  'Einleitungstext',
  'Intro content',
  '',
  ['h1', 'h2', 'h3', 'h4'],
)

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      ...introContentField,
      admin: {
        ...introContentField.admin,
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
