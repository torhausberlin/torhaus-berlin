'use client'

import type { Project } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { useLocale } from 'next-intl'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  projects: Project[]
  blockId?: string
  disableInnerContainer?: boolean
}

export function ProjectsListingClient(props: Props) {
  const { blockId, disableInnerContainer, projects } = props
  const locale = useLocale()
  const allLabel = locale === 'de' ? 'Alle' : 'All'
  const closeLabel = locale === 'de' ? 'Schließen' : 'Close'

  const years = useMemo(() => {
    const set = new Set<number>()
    for (const p of projects) {
      if (typeof p.year === 'number' && !Number.isNaN(p.year)) set.add(p.year)
    }
    return Array.from(set).sort((a, b) => b - a)
  }, [projects])

  const [yearFilter, setYearFilter] = useState<number | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (yearFilter === 'all') return projects
    return projects.filter((p) => p.year === yearFilter)
  }, [projects, yearFilter])

  useEffect(() => {
    if (expandedId && !filtered.some((p) => p.id === expandedId)) {
      setExpandedId(null)
    }
  }, [expandedId, filtered])

  const toggleExpanded = useCallback((projectId: string) => {
    setExpandedId((current) => (current === projectId ? null : projectId))
  }, [])

  const collapse = useCallback(() => {
    setExpandedId(null)
  }, [])

  useEffect(() => {
    if (!expandedId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapse()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [collapse, expandedId])

  return (
    <section
      className={cn('w-full', !disableInnerContainer && 'container')}
      id={blockId ? `block-${blockId}` : undefined}
    >
      <div className="flex w-full flex-wrap gap-2 py-4">
        <button
          type="button"
          onClick={() => setYearFilter('all')}
          className={cn(
            'rounded-full border border-black px-3 py-1 text-sm font-medium transition-colors hover:cursor-pointer',
            yearFilter === 'all' ? 'bg-black text-white' : 'bg-white text-black',
          )}
        >
          {allLabel}
        </button>
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setYearFilter(year)}
            className={cn(
              'rounded-full border border-black px-3 py-1 text-sm font-medium transition-colors hover:cursor-pointer',
              yearFilter === year ? 'bg-black text-white' : 'bg-white text-black',
            )}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="grid w-full grid-cols-1 gap-px border-t-2 border-black bg-black px-px pb-px sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => {
          const isExpanded = expandedId === project.id
          const title = project.title
          const image = project.image
          const participants = project.participants
          const description = project.description

          return (
            <div key={project.id} className={cn('min-w-0 bg-white', isExpanded && 'col-span-full')}>
              {!isExpanded ? (
                <button
                  type="button"
                  aria-expanded={false}
                  aria-label={title ? `${title}` : 'Project'}
                  onClick={() => toggleExpanded(project.id)}
                  className="group relative flex w-full cursor-pointer flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:aspect-3/4"
                >
                  {image && typeof image === 'object' ? (
                    <>
                      <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden md:absolute md:inset-0 md:h-full">
                        <Media
                          className="absolute inset-0 block h-full w-full"
                          fill
                          htmlElement="div"
                          imgClassName="object-cover"
                          resource={image}
                          size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-200 [@media(hover:hover)]:group-hover:opacity-90 max-md:hidden"
                          aria-hidden
                        />
                        {title ? (
                          <div className="absolute inset-0 z-1 hidden items-center justify-center p-4 opacity-0 transition-opacity duration-200 [@media(hover:hover)]:group-hover:opacity-100 md:flex">
                            <span className="text-center font-mono text-lg font-bold text-black md:text-xl">
                              {title}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      {title ? (
                        <div className="border-t border-black bg-white p-3 md:hidden">
                          <span className="font-mono text-base font-bold text-black">{title}</span>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </button>
              ) : (
                <div className="flex w-full flex-col">
                  <div className="flex justify-end border-b border-black px-3 py-2">
                    <button
                      type="button"
                      onClick={collapse}
                      className="rounded-full border border-black bg-white px-3 py-1 text-sm font-medium text-black hover:bg-black hover:text-white hover:cursor-pointer  "
                    >
                      {closeLabel}
                    </button>
                  </div>
                  <div className="grid w-full md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                    {image && typeof image === 'object' ? (
                      <button
                        type="button"
                        aria-label={closeLabel}
                        onClick={collapse}
                        className="relative aspect-4/3 min-h-48 w-full cursor-pointer border-b border-black text-left md:border-b-0 md:border-r"
                      >
                        <Media
                          className="absolute inset-0 block h-full w-full"
                          fill
                          htmlElement="div"
                          imgClassName="object-cover"
                          resource={image}
                          size="100vw"
                        />
                      </button>
                    ) : null}
                    <div className="flex flex-col gap-4 p-6 md:p-8">
                      {title ? (
                        <h2 className="font-mono text-2xl font-bold text-black md:text-3xl">
                          {title}
                        </h2>
                      ) : null}
                      {typeof project.year === 'number' ? (
                        <p className="font-mono text-sm font-semibold text-black">{project.year}</p>
                      ) : null}
                      {participants ? (
                        <p className="max-w-prose text-base text-black">{participants}</p>
                      ) : null}
                      {description ? (
                        <RichText
                          className="max-w-prose text-black"
                          data={description}
                          enableGutter={false}
                          enableProse={false}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
