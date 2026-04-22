import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

/** Default document + Open Graph description when a page has none in CMS. */
export const defaultSiteDescription =
  'Torhaus Berlin e.V. is a non-profit organization based in the former Tempelhof Airport in Berlin.'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: defaultSiteDescription,
  images: [
    {
      url: `${getServerSideURL()}/og-image.jpg`,
    },
  ],
  siteName: 'Torhaus Berlin e.V.',
  title: 'Torhaus Berlin e.V.',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  if (!og) {
    return { ...defaultOpenGraph }
  }

  const { images, description, ...rest } = og
  const resolvedDescription =
    typeof description === 'string' && description.trim() !== ''
      ? description
      : defaultOpenGraph.description

  return {
    ...defaultOpenGraph,
    ...rest,
    description: resolvedDescription,
    images: images ?? defaultOpenGraph.images,
  }
}
