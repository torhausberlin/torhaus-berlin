'use client'

import React from 'react'

import type { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ExternalLinkRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['externalImageLinks']>[number]>()

  const url = data?.data?.url
  const rowNum = data.rowNumber !== undefined ? data.rowNumber + 1 : ''

  const label = url ? `External link ${rowNum}: ${url}` : `External link ${rowNum}`

  return <div>{label}</div>
}
