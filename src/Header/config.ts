import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
          localized: true,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'externalImageLinks',
      type: 'array',
      label: 'External links (with image)',
      labels: {
        singular: 'Link',
        plural: 'External image links',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Full URL, e.g. https://example.com',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Open in new tab',
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/ExternalLinkRowLabel#ExternalLinkRowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
