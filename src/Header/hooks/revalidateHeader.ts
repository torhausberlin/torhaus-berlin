import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import { revalidateAllLocalizedLayouts } from '@/utilities/revalidateAllLocalizedLayouts'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    revalidateTag('global_header', 'max')
    revalidateAllLocalizedLayouts()
  }

  return doc
}
