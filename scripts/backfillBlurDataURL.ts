/**
 * One-off: generate `blurDataURL` for Media docs uploaded before the upload hook existed.
 *
 *   pnpm backfill:blur                        # local dev (.env.development)
 *   DRY_RUN=1 pnpm backfill:blur              # generate only, write nothing
 *   NODE_ENV=production pnpm backfill:blur    # on the server (.env.production)
 *
 * `payload run` drops CLI flags from process.argv, hence env vars for options.
 *
 * Reads files from `public/media` (override with MEDIA_DIR), falling back to HTTP via
 * NEXT_PUBLIC_MEDIA_URL / NEXT_PUBLIC_SERVER_URL for relative Payload URLs.
 */
import fs from 'node:fs/promises'
import path from 'node:path'

import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import { createBlurDataURL } from '@/hooks/generateBlurDataURL'
import type { Media } from '@/payload-types'
import { getPublicMediaBaseUrl } from '@/utilities/getMediaUrl'

const BATCH_SIZE = 25
const dryRun = Boolean(process.env.DRY_RUN)
const mediaDir = path.resolve(process.env.MEDIA_DIR || path.join(process.cwd(), 'public/media'))

async function readSource(doc: Media): Promise<{ buffer: Buffer; from: string } | null> {
  if (doc.filename) {
    const filePath = path.join(mediaDir, doc.filename)
    try {
      return { buffer: await fs.readFile(filePath), from: filePath }
    } catch {
      // not on disk here; try HTTP
    }
  }

  if (!doc.url) return null
  const base = getPublicMediaBaseUrl()
  const isAbsolute = /^https?:\/\//i.test(doc.url)
  if (!isAbsolute && !base) return null
  const url = isAbsolute ? doc.url : `${base}${doc.url.startsWith('/') ? '' : '/'}${doc.url}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return { buffer: Buffer.from(await res.arrayBuffer()), from: url }
}

const payload = await getPayload({ config })
const log = payload.logger
const processed: string[] = []
let updated = 0
let failed = 0

log.info(`Backfilling blurDataURL${dryRun ? ' (dry run)' : ''}; media dir: ${mediaDir}`)

while (true) {
  const where: Where = {
    and: [
      { mimeType: { contains: 'image/' } },
      {
        or: [
          { blurDataURL: { exists: false } },
          { blurDataURL: { equals: null } },
          { blurDataURL: { equals: '' } },
        ],
      },
      ...(processed.length ? [{ id: { not_in: processed } }] : []),
    ],
  }

  // Always page 1: updated docs drop out of the filter, processed IDs are excluded.
  const { docs } = await payload.find({
    collection: 'media',
    where,
    limit: BATCH_SIZE,
    page: 1,
    depth: 0,
  })
  if (docs.length === 0) break

  for (const doc of docs) {
    processed.push(doc.id)
    try {
      const source = await readSource(doc)
      if (!source) {
        failed++
        log.warn(`[${doc.id}] ${doc.filename}: no file on disk and no resolvable URL`)
        continue
      }

      const blurDataURL = await createBlurDataURL(source.buffer)
      if (!dryRun) {
        await payload.update({ collection: 'media', id: doc.id, data: { blurDataURL }, depth: 0 })
      }
      updated++
      log.info(`[${doc.id}] ${doc.filename} (${blurDataURL.length} chars) from ${source.from}`)
    } catch (err) {
      failed++
      log.error({ err, msg: `[${doc.id}] ${doc.filename}: failed` })
    }
  }
}

log.info(
  `Done. ${dryRun ? 'Would update' : 'Updated'} ${updated}, failed ${failed}, total ${processed.length}.`,
)
process.exit(failed > 0 ? 1 : 0)
