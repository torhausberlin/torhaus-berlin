import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Project } from '../../../payload-types'
import { revalidateAllLocalizedLayouts } from '../../../utilities/revalidateAllLocalizedLayouts'

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const isPublished = doc._status === 'published'
    const wasPublished = previousDoc?._status === 'published'
    const shouldRevalidate = isPublished || (wasPublished && !isPublished)

    if (shouldRevalidate) {
      payload.logger.info('Revalidating pages after project change')
      revalidateAllLocalizedLayouts()
    }
  }
  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook<Project> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?._status === 'published') {
    revalidateAllLocalizedLayouts()
  }
  return doc
}
