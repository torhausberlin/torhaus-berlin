import type { CollectionBeforeChangeHook } from 'payload'
import { getPlaiceholder } from 'plaiceholder'

export async function createBlurDataURL(buffer: Buffer): Promise<string> {
  const { base64 } = await getPlaiceholder(buffer, { size: 10 })
  return base64
}

export const generateBlurDataURL: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') {
    return data
  }

  const buffer = req.file?.data
  if (!buffer || buffer.byteLength === 0) {
    return data
  }

  try {
    return {
      ...data,
      blurDataURL: await createBlurDataURL(buffer),
    }
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: 'Failed to generate blurDataURL for media upload',
    })
    return data
  }
}
