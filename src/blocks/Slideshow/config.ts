import type { Block } from 'payload'

export const Slideshow: Block = {
  slug: 'slideshow',
  interfaceName: 'SlideshowBlock',
  fields: [
    {
      name: 'gallery',
      type: 'array',
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
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Slideshows',
    singular: 'Slideshow',
  },
}
