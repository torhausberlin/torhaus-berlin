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
    image: true,
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { de: 'Bild', en: 'Image' },
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
