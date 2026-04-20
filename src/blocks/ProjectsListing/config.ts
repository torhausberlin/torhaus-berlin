import type { Block } from 'payload'

export const ProjectsListing: Block = {
  slug: 'projectsListing',
  interfaceName: 'ProjectsListingBlock',
  fields: [
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      label: { de: 'Quelle', en: 'Source' },
      options: [
        {
          label: { de: 'Alle veröffentlichten Projekte', en: 'All published projects' },
          value: 'collection',
        },
        {
          label: { de: 'Manuelle Auswahl', en: 'Individual selection' },
          value: 'selection',
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 24,
      label: { de: 'Limit (alle Projekte)', en: 'Limit (all projects)' },
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: { de: 'Ausgewählte Projekte', en: 'Selected projects' },
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
  ],
  labels: {
    singular: { de: 'Projektliste', en: 'Projects listing' },
    plural: { de: 'Projektlisten', en: 'Projects listings' },
  },
}
