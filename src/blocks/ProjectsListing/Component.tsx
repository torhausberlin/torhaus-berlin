import type { Project, ProjectsListingBlock as ProjectsListingBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { toPayloadLocale } from '@/i18n/routing'
import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import React from 'react'

import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import { ProjectsListingClient } from './Component.client'

function projectIdsFromSelection(
  selected: ProjectsListingBlockProps['selectedDocs'],
): string[] {
  if (!selected?.length) return []
  return selected
    .map((item) => {
      if (typeof item === 'string') return item
      if (typeof item === 'object' && item && 'id' in item) return item.id
      return null
    })
    .filter((id): id is string => Boolean(id))
}

export const ProjectsListingBlock: React.FC<
  ProjectsListingBlockProps & {
    disableInnerContainer?: boolean
    id?: string
  } & RevealableBlockProps
> = async (props) => {
  const { disableInnerContainer, id, limit: limitFromProps, populateBy, selectedDocs, revealStaggerIndex } =
    props

  const payload = await getPayload({ config: configPromise })
  const locale = toPayloadLocale(await getLocale())
  const limit = limitFromProps ?? 24

  let projects: Project[] = []

  if (populateBy === 'selection') {
    const ids = projectIdsFromSelection(selectedDocs)
    if (ids.length) {
      const fetched = await payload.find({
        collection: 'projects',
        depth: 2,
        limit: ids.length,
        locale,
        overrideAccess: true,
        where: {
          and: [{ id: { in: ids } }, { _status: { equals: 'published' } }],
        },
      })
      const byId = new Map(fetched.docs.map((doc) => [doc.id, doc]))
      projects = ids.map((docId) => byId.get(docId)).filter((doc): doc is Project => Boolean(doc))
    }
  } else {
    const fetched = await payload.find({
      collection: 'projects',
      depth: 2,
      limit,
      locale,
      overrideAccess: true,
      sort: '-year',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })
    projects = fetched.docs
  }

  if (projects.length === 0) return null

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <ProjectsListingClient
        blockId={id}
        disableInnerContainer={disableInnerContainer}
        projects={projects}
      />
    </BlockScrollReveal>
  )
}
