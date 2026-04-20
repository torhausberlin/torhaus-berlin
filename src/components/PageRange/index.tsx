import { getTranslations } from 'next-intl/server'
import React from 'react'

const collectionMessageKeys = {
  posts: { plural: 'postsPlural' as const, singular: 'postsSingular' as const },
} as const

export const PageRange: React.FC<{
  className?: string
  collection?: keyof typeof collectionMessageKeys
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = async (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  const t = await getTranslations('PageRange')

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  let plural: string | undefined
  let singular: string | undefined

  if (collectionLabelsFromProps) {
    plural = collectionLabelsFromProps.plural
    singular = collectionLabelsFromProps.singular
  } else if (collection && collectionMessageKeys[collection]) {
    const keys = collectionMessageKeys[collection]
    plural = t(keys.plural)
    singular = t(keys.singular)
  } else {
    plural = t('docsPlural')
    singular = t('docsSingular')
  }

  const label = totalDocs && totalDocs > 1 ? plural : singular

  const dashPart = indexStart > 0 ? ` - ${indexEnd}` : ''

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && t('noResults')}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        t('showing', {
          start: String(indexStart),
          dashPart,
          total: String(totalDocs),
          label: label || '',
        })}
    </div>
  )
}
