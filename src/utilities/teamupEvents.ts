import 'server-only'

import { unstable_cache } from 'next/cache'
import ical, { expandRecurringEvent, type ParameterValue, type VEvent } from 'node-ical'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export type TeamupListEvent = {
  id: string
  title: string
  start: Date
  end: Date
  description: string
  location: string
  isFullDay: boolean
}

function paramString(v: ParameterValue | undefined): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  return String(v.val ?? '')
}

function describeString(v: ParameterValue | undefined): string {
  const raw = paramString(v)
  return raw.replace(/\\n/g, '\n').trim()
}

const FETCH_TIMEOUT_MS = 20_000

async function fetchIcsText(url: string): Promise<string> {
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { Accept: 'text/calendar, text/plain, */*' },
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`)
    }
    return res.text()
  } finally {
    clearTimeout(t)
  }
}

function veventsFromCalendar(ics: string): VEvent[] {
  const data = ical.parseICS(ics)
  return Object.values(data).filter((c): c is VEvent => c?.type === 'VEVENT')
}

function mapInstances(vevents: VEvent[], from: Date, to: Date): TeamupListEvent[] {
  const out: TeamupListEvent[] = []

  for (const event of vevents) {
    if (event.status === 'CANCELLED') continue
    if (!event.uid) continue

    const instances = expandRecurringEvent(event, {
      from,
      to,
      expandOngoing: true,
    })

    for (const inst of instances) {
      const start = new Date(inst.start)
      const end = new Date(inst.end)
      if (end.getTime() <= from.getTime() || start.getTime() >= to.getTime()) {
        continue
      }

      const title = paramString(inst.summary) || paramString(event.summary) || 'Event'
      const baseEvent = inst.event
      out.push({
        id: `${event.uid}:${start.getTime()}`,
        title,
        start,
        end,
        description: describeString(baseEvent.description),
        location: paramString(baseEvent.location) || paramString(event.location),
        isFullDay: inst.isFullDay,
      })
    }
  }

  return out
}

export type GetTeamupEventsOptions = {
  daysAhead: number
}

async function getTeamupEventsImpl(options: GetTeamupEventsOptions): Promise<TeamupListEvent[]> {
  const { daysAhead } = options
  const now = new Date()
  const windowEnd = new Date(now.getTime() + Math.max(1, daysAhead) * MS_PER_DAY)

  const publicUrl = process.env.TEAMUP_ICAL_PUBLIC_URL
  if (!publicUrl?.trim()) {
    return []
  }

  try {
    const ics = await fetchIcsText(publicUrl)
    const vevents = veventsFromCalendar(ics)
    const list = mapInstances(vevents, now, windowEnd)
    list.sort((a, b) => a.start.getTime() - b.start.getTime())
    return list
  } catch (e) {
    console.error('[teamupEvents] failed to load public calendar:', e)
    return []
  }
}

function withParsedDates(ev: TeamupListEvent): TeamupListEvent {
  return {
    ...ev,
    // unstable_cache serializes return values; Dates come back as ISO strings.
    start: new Date(ev.start as unknown as string | number | Date),
    end: new Date(ev.end as unknown as string | number | Date),
  }
}

/**
 * Fetches and normalizes the public TeamUp iCal feed with request-level caching.
 * Env: TEAMUP_ICAL_PUBLIC_URL (server-only).
 */
export async function getTeamupEventsCached(
  options: GetTeamupEventsOptions,
): Promise<TeamupListEvent[]> {
  const { daysAhead } = options
  const raw = await unstable_cache(
    () => getTeamupEventsImpl({ daysAhead }),
    ['teamup-events', 'public', String(daysAhead)],
    { revalidate: 300 },
  )()
  return raw.map(withParsedDates)
}
