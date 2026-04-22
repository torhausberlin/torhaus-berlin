import type { Block } from 'payload'

export const EventListing: Block = {
  slug: 'eventListing',
  interfaceName: 'EventListingBlock',
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
      name: 'daysAhead',
      type: 'number',
      defaultValue: 60,
      min: 1,
      max: 365,
      label: { de: 'Tage voraus', en: 'Days ahead' },
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 500,
      defaultValue: 100,
      label: { de: 'Max. Einträge', en: 'Max entries' },
    },
  ],
  labels: {
    singular: { de: 'Veranstaltungsliste', en: 'Event listing' },
    plural: { de: 'Veranstaltungslisten', en: 'Event listings' },
  },
}
