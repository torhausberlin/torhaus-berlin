import type { Block } from 'payload'

export const SectionHeading: Block = {
  slug: 'sectionHeading',
  interfaceName: 'SectionHeadingBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
      ],
    },
  ],
  labels: {
    plural: 'Section headings',
    singular: 'Section heading',
  },
}
