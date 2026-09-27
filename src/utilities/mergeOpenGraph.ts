import type { Metadata } from 'next'
import { SITE_NAME } from './jsonLd'
import { getServerSideURL } from './getURL'

/** English last-resort description; locale layouts override via `Site.defaultDescription`. */
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
  siteName: SITE_NAME,
  title: SITE_NAME,
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
