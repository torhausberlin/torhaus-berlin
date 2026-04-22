import type { EventListingBlock as EventListingBlockProps } from '@/payload-types'

import { SectionHeadingBlock } from '@/blocks/SectionHeading/Component'
import { BlockScrollReveal, type RevealableBlockProps } from '@/components/RevealOnScroll'
import { getTeamupEventsCached, type TeamupListEvent } from '@/utilities/teamupEvents'
import { cn } from '@/utilities/ui'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'

const GRID_COLS = 3

type CardDateParts = {
  month: string
  dayLine: string
  timeLine: string
  /** when true, show translated "all day" in UI instead of timeLine */
  isAllDay: boolean
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

function getCardDateParts(
  startIn: Date | string,
  endIn: Date | string,
  isFullDay: boolean,
  locale: string,
): CardDateParts {
  const startD = toDate(startIn)
  let endD = toDate(endIn)
  if (isFullDay) {
    endD = new Date(endD.getTime() - 1)
  }

  const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(startD).toUpperCase()

  const sameDay =
    startD.getFullYear() === endD.getFullYear() &&
    startD.getMonth() === endD.getMonth() &&
    startD.getDate() === endD.getDate()

  let dayLine: string
  if (sameDay) {
    dayLine = String(startD.getDate())
  } else if (startD.getFullYear() === endD.getFullYear() && startD.getMonth() === endD.getMonth()) {
    dayLine = `${startD.getDate()} – ${endD.getDate()}`
  } else {
    const df = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
    dayLine = `${df.format(startD)} – ${df.format(endD)}`
  }

  if (isFullDay) {
    return { month, dayLine, timeLine: '', isAllDay: true }
  }
  if (sameDay) {
    const tf = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })
    return {
      month,
      dayLine,
      timeLine: `${tf.format(startD)} – ${tf.format(endD)}`,
      isAllDay: false,
    }
  }
  const df = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' })
  return { month, dayLine, timeLine: `${df.format(startD)} – ${df.format(endD)}`, isAllDay: false }
}

function EventGridCard({
  ev,
  variant,
  dateParts,
  allDayLabel,
}: {
  ev: TeamupListEvent
  variant: 0 | 1
  dateParts: CardDateParts
  allDayLabel: string
}) {
  const isDark = variant === 0
  const hasLocation = Boolean(ev.location?.trim())
  return (
    <article
      className={cn(
        'group relative flex aspect-square min-h-0 w-full min-w-0 flex-col p-4 shadow-none transition-shadow duration-200   md:p-5',
        isDark
          ? 'bg-torhaus-yellow text-black hover:shadow-md'
          : 'bg-zinc-100 text-zinc-900 hover:shadow-md',
      )}
    >
      <div className="shrink-0 text-left">
        <p
          className={cn(
            'font-sans text-base font-semibold uppercase tracking-[0.18em]  lg:text-base',
          )}
        >
          {dateParts.month}
        </p>
        <p className="mt-1 font-heading text-4xl font-bold leading-none tracking-tight md:text-6xl">
          {dateParts.dayLine}
        </p>
      </div>
      <div className="min-h-0 flex-1 py-2 sm:py-3">
        <p className="line-clamp-4 text-xl font-medium leading-snug wrap-break-word  lg:text-3xl">
          {ev.title}
        </p>
      </div>
      <div className="mt-auto flex shrink-0 items-end justify-between gap-2 pt-1">
        <div className="min-w-0 text-left text-lg leading-tight  lg:text-base">
          {dateParts.isAllDay ? (
            <p className="font-mono font-medium tabular-nums tracking-wide opacity-90">
              {allDayLabel}
            </p>
          ) : (
            <p className="font-mono font-medium tabular-nums tracking-wide opacity-90">
              {dateParts.timeLine}
            </p>
          )}
          {hasLocation ? (
            <p
              className={cn(
                'mt-0.5 line-clamp-2 font-sans text-xs wrap-break-word ',
                isDark ? 'text-white/90' : 'text-zinc-700',
              )}
            >
              {ev.location}
            </p>
          ) : null}
        </div>
        {/* <div
          className="shrink-0 opacity-80 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        </div> */}
      </div>
    </article>
  )
}

export const EventListingBlock: React.FC<
  EventListingBlockProps & {
    disableInnerContainer?: boolean
    id?: string
  } & RevealableBlockProps
> = async (props) => {
  const {
    sectionHeading,
    daysAhead,
    limit: limitFromProps,
    disableInnerContainer,
    id,
    revealStaggerIndex,
  } = props
  const limit = limitFromProps ?? 100
  const t = await getTranslations('EventListing')
  const locale = await getLocale()

  const events = await getTeamupEventsCached({
    daysAhead: daysAhead ?? 60,
  })
  const limited = events.slice(0, limit)

  const headingText = sectionHeading?.heading?.trim()

  const headingInnerClass = cn(
    !disableInnerContainer
      ? 'container py-6 text-center tracking-widest lg:py-12'
      : 'w-full px-4 py-6 text-center tracking-widest md:px-8 lg:py-12',
  )

  const mainContentPad =
    !disableInnerContainer && (headingText ? 'py-10 lg:py-14' : 'py-6 lg:py-12')

  if (limited.length === 0) {
    return (
      <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
        <div className="w-full" id={id ? `block-${id}` : undefined}>
          {headingText ? (
            <div className="w-full border-b-[3px] border-black">
              <div className={headingInnerClass}>
                <SectionHeadingBlock
                  unboxed
                  blockType="sectionHeading"
                  heading={headingText}
                  level={sectionHeading?.level ?? 'h2'}
                />
              </div>
            </div>
          ) : null}
          <div
            className={cn(
              'w-full text-black',
              !disableInnerContainer && 'container py-10 lg:py-14',
              disableInnerContainer && 'px-4 py-10 md:px-8 lg:py-14',
            )}
          >
            <p className="m-0 text-base leading-relaxed text-black/80">{t('empty')}</p>
          </div>
        </div>
      </BlockScrollReveal>
    )
  }

  const totalSlots = Math.ceil(limited.length / GRID_COLS) * GRID_COLS

  return (
    <BlockScrollReveal revealStaggerIndex={revealStaggerIndex}>
      <div className="w-full" id={id ? `block-${id}` : undefined}>
        {headingText ? (
          <div className="w-full border-b-[3px] border-black">
            <div className={headingInnerClass}>
              <SectionHeadingBlock
                unboxed
                blockType="sectionHeading"
                heading={headingText}
                level={sectionHeading?.level ?? 'h2'}
              />
            </div>
          </div>
        ) : null}
        <div className={cn('w-full', !disableInnerContainer && 'container', mainContentPad)}>
          <div className="grid grid-cols-1  md:grid-cols-3">
            {Array.from({ length: totalSlots }, (_, i) => {
              if (i < limited.length) {
                const ev = limited[i]!
                const dateParts = getCardDateParts(ev.start, ev.end, ev.isFullDay, locale)
                return (
                  <div key={ev.id} className="min-w-0">
                    <EventGridCard
                      ev={ev}
                      variant={i % 2 === 0 ? 0 : 1}
                      dateParts={dateParts}
                      allDayLabel={t('allDay')}
                    />
                  </div>
                )
              }
              return (
                <div
                  key={`filler-${i}`}
                  className="aspect-square min-h-0 w-full min-w-0 bg-black"
                  aria-hidden
                  role="presentation"
                />
              )
            })}
          </div>
        </div>
      </div>
    </BlockScrollReveal>
  )
}
