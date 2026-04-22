import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { richTextField } from '@/fields/richTextField'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidateProject'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'updatedAt'],
  },
  defaultPopulate: {
    title: true,
    gallery: true,
    year: true,
    participants: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: { de: 'Titel', en: 'Title' },
    },
    {
      name: 'gallery',
      type: 'array',
      label: { de: 'Galerie', en: 'Gallery' },
      labels: {
        singular: { de: 'Bild', en: 'Image' },
        plural: { de: 'Bilder', en: 'Images' },
      },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: {
          de: 'Mehrere Bilder: in der Übersicht wird das erste gezeigt; in der Detailansicht eine Slideshow.',
          en: 'Multiple images: the listing shows the first; the detail view is a slideshow of all images.',
        },
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
    richTextField('description', true, 'Beschreibung', 'Description'),
    {
      name: 'year',
      type: 'number',
      required: true,
      label: { de: 'Jahr', en: 'Year' },
      admin: {
        description: {
          de: 'Jahr für Anzeige und Filter.',
          en: 'Year for display and filters.',
        },
        step: 1,
      },
    },
    {
      name: 'participants',
      type: 'text',
      localized: true,
      label: { de: 'Teilnehmende', en: 'Participants' },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
  },
}
