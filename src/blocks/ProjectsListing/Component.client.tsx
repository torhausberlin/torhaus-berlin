'use client'

import type { Project } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  projects: Project[]
  blockId?: string
  disableInnerContainer?: boolean
}

function ProjectDetailMetaRow({
  label,
  children: value,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <tr>
      <th
        scope="row"
        className="w-0 border border-black px-3 py-1 lg:py-2 text-left align-top font-semibold whitespace-nowrap text-black"
      >
        {label}
      </th>
      <td className="min-w-0 border border-black px-3 py-1 lg:py-2 align-top text-black">
        {value}
      </td>
    </tr>
  )
}

export function ProjectsListingClient(props: Props) {
  const { blockId, disableInnerContainer, projects } = props
  const t = useTranslations('ProjectsListing')

  const years = useMemo(() => {
    const set = new Set<number>()
    for (const p of projects) {
      if (typeof p.year === 'number' && !Number.isNaN(p.year)) set.add(p.year)
    }
    return Array.from(set).sort((a, b) => b - a)
  }, [projects])

  const [yearFilter, setYearFilter] = useState<number | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const expandedCloseBarRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(() => {
    if (yearFilter === 'all') return projects
    return projects.filter((p) => p.year === yearFilter)
  }, [projects, yearFilter])

  const visibleProjects = useMemo(() => {
    if (!expandedId) return filtered
    return filtered.filter((p) => p.id === expandedId)
  }, [expandedId, filtered])

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

  useEffect(() => {
    if (!expandedId) return
    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    if (!isMobile) return

    let cancelled = false
    const run = () => {
      if (cancelled) return
      const el = expandedCloseBarRef.current
      if (!el) return
      const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'start' })
    }

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(run)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [expandedId])

  return (
    <section
      className={cn('w-full', !disableInnerContainer && 'container')}
      id={blockId ? `block-${blockId}` : undefined}
    >
      {/* Year Filter */}
      <div className="flex w-full flex-wrap gap-2 lg:gap-4 py-4 container">
        <button
          type="button"
          onClick={() => setYearFilter('all')}
          className={cn(
            'rounded-full border border-black px-3 py-1 text-sm font-medium transition-colors hover:cursor-pointer',
            yearFilter === 'all' ? 'bg-black text-white' : 'bg-white text-black',
          )}
        >
          {t('all')}
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

      {/* Projects Listing */}
      <div
        className={cn(
          'grid w-full gap-px border-t-2 border-black bg-black px-px pb-px',
          expandedId ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {visibleProjects.map((project) => {
          const isExpanded = expandedId === project.id
          const title = project.title
          const image = project.image
          const participants = project.participants
          const description = project.description

          return (
            <div key={project.id} className="min-w-0 bg-white">
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
                          <div className="absolute inset-x-0 top-1/2 z-1 -translate-y-1/2 bg-white/75 px-4 py-3 text-center md:hidden">
                            <span className="font-mono text-lg font-bold text-black">{title}</span>
                          </div>
                        ) : null}
                        {title ? (
                          <div className="absolute inset-0 z-1 hidden items-center justify-center p-4 opacity-0 transition-opacity duration-200 [@media(hover:hover)]:group-hover:opacity-100 md:flex">
                            <span className="text-center font-mono text-lg font-bold text-black md:text-3xl">
                              {title}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </button>
              ) : (
                <div className="flex w-full flex-col">
                  <div
                    ref={expandedCloseBarRef}
                    className="flex justify-end border-b border-black px-3 py-2 max-lg:scroll-mt-[calc(0.75rem+2.75rem+0.75rem+1px)] md:max-lg:scroll-mt-[calc(1rem+5rem+1rem+1px)]"
                  >
                    <button
                      type="button"
                      onClick={collapse}
                      className="rounded-full border border-black bg-white px-3 py-1 text-sm font-medium text-black hover:bg-black hover:text-white hover:cursor-pointer  "
                    >
                      {t('close')}
                    </button>
                  </div>
                  <div className="grid w-full md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                    {image && typeof image === 'object' ? (
                      <button
                        type="button"
                        aria-label={t('close')}
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
                    <div className="flex flex-col gap-8 p-6 md:p-8">
                      {title ? (
                        <h2 className="font-mono text-2xl font-bold text-black md:text-3xl">
                          {title}
                        </h2>
                      ) : null}
                      {typeof project.year === 'number' || participants ? (
                        <table className="w-full max-w-prose border-collapse border border-black font-mono text-sm lg:text-base">
                          <tbody>
                            {typeof project.year === 'number' ? (
                              <ProjectDetailMetaRow label={t('year')}>
                                {project.year}
                              </ProjectDetailMetaRow>
                            ) : null}
                            {participants ? (
                              <ProjectDetailMetaRow label={t('participants')}>
                                {participants}
                              </ProjectDetailMetaRow>
                            ) : null}
                          </tbody>
                        </table>
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
