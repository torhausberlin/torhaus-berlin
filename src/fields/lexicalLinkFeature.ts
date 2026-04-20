import { LinkFeature } from '@payloadcms/richtext-lexical'

const defaultRelationTo: Array<'pages' | 'posts'> = ['pages', 'posts']

/**
 * Lexical link: internal references, custom URLs, optional anchor + new tab.
 * Extend default link fields with anchor helpers (scroll to `#sectionId`).
 */
export const lexicalLinkFeature = (relationTo: Array<'pages' | 'posts'> = defaultRelationTo) => {
  return LinkFeature({
    enabledCollections: relationTo,
    fields: ({ defaultFields }) => {
      return [
        ...defaultFields,
        {
          name: 'isAnchorLink',
          type: 'checkbox',
          label: {
            de: 'Ist ein Anker-Link (Seitenabschnitt)',
            en: 'Is an anchor link (page section)',
          },
          defaultValue: false,
          admin: {
            description: {
              de: 'Aktivieren, um zu einem Seitenabschnitt zu scrollen',
              en: 'Enable to scroll to a page section',
            },
          },
        },
        {
          name: 'sectionId',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.isAnchorLink === true,
            description: {
              de: 'ID des Seitenabschnitts (z.B. "kontakt", "preise")',
              en: 'Section ID to scroll to (e.g. "contact", "prices")',
            },
          },
          label: {
            de: 'Abschnitt-ID',
            en: 'Section ID',
          },
        },
      ]
    },
  })
}
