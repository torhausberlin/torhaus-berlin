import type { Block } from 'payload'

import { richTextField } from '@/fields/richTextField'

const galleryFields = [
  {
    name: 'gallery',
    type: 'array' as const,
    label: 'Gallery',
    labels: {
      singular: 'Slide',
      plural: 'Gallery',
    },
    minRows: 1,
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'image',
        type: 'upload' as const,
        relationTo: 'media' as const,
        required: true,
      },
    ],
  },
]

const columnText: Block = {
  slug: 'columnText',
  interfaceName: 'TwoColumnColumnText',
  fields: [richTextField('content', false, '', '', '')],
  labels: {
    plural: 'Text',
    singular: 'Text',
  },
}

const columnSlideshow: Block = {
  slug: 'columnSlideshow',
  interfaceName: 'TwoColumnColumnSlideshow',
  fields: [...galleryFields],
  labels: {
    plural: 'Slideshows',
    singular: 'Slideshow',
  },
}

const columnMedia: Block = {
  slug: 'columnMedia',
  interfaceName: 'TwoColumnColumnMedia',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  labels: {
    plural: 'Media',
    singular: 'Media',
  },
}

const columnBlockOptions = [columnText, columnSlideshow, columnMedia]

export const TwoColumn: Block = {
  slug: 'twoColumn',
  interfaceName: 'TwoColumnBlock',
  fields: [
    {
      name: 'sectionHeading',
      type: 'group',
      label: 'Section heading (optional)',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
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
    },
    {
      name: 'leftColumn',
      type: 'blocks',
      label: 'Left column',
      blocks: columnBlockOptions,
      maxRows: 1,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'rightColumn',
      type: 'blocks',
      label: 'Right column',
      blocks: columnBlockOptions,
      maxRows: 1,
      admin: {
        initCollapsed: true,
      },
    },
  ],
  labels: {
    plural: 'Two columns',
    singular: 'Two column',
  },
}
