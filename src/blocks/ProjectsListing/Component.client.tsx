'use client'

import type { Project } from '@/payload-types'

import { SlideshowBlock } from '@/blocks/Slideshow/Component'
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
        className="w-0 py-0.5 pr-2 text-left align-top font-semibold leading-tight whitespace-nowrap text-black"
      >
        {label}
      </th>
      <td className="min-w-0 py-0.5 pl-3 text-left align-top leading-tight text-black">{value}</td>
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
      <div className="container flex w-full flex-wrap gap-1 py-3 lg:gap-2">
        <button
          type="button"
          onClick={() => setYearFilter('all')}
          className={cn(
            'rounded-full border-2 border-black px-3 py-1 text-sm font-semibold transition-colors hover:cursor-pointer',
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
              'rounded-full border-2 border-black px-3 py-1 text-sm font-semibold transition-colors hover:cursor-pointer',
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
          'grid w-full border-t-[3px] border-black',
          expandedId
            ? 'grid-cols-1'
            : 'grid-cols-1 gap-px bg-black px-px pb-px sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {visibleProjects.map((project) => {
          const isExpanded = expandedId === project.id
          const title = project.title
          const firstSlide = project.gallery?.[0]
          const firstImage =
            firstSlide && typeof firstSlide.image === 'object' ? firstSlide.image : null
          const hasGallery = Boolean(
            project.gallery?.length &&
            project.gallery.some((row) => row.image && typeof row.image === 'object'),
          )
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
                  {firstImage ? (
                    <>
                      <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden md:absolute md:inset-0 md:h-full">
                        <Media
                          className="absolute inset-0 block h-full w-full"
                          fill
                          htmlElement="div"
                          imgClassName="object-cover"
                          resource={firstImage}
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
                    className="flex justify-end border-b-[3px] border-black px-3 py-3 max-lg:scroll-mt-[calc(0.75rem+2.75rem+0.75rem+3px)] md:max-lg:scroll-mt-[calc(1rem+5rem+1rem+3px)]"
                  >
                    <button
                      type="button"
                      onClick={collapse}
                      className="rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white hover:cursor-pointer"
                    >
                      {t('close')}
                    </button>
                  </div>
                  <div className="grid w-full min-h-0 md:min-h-[60vh] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-stretch md:grid-rows-[minmax(60vh,auto)]">
                    {hasGallery && project.gallery ? (
                      <div className="flex w-full min-h-48 flex-col border-b-[3px] border-black md:min-h-0 md:border-b-0 md:border-r-[3px]">
                        <div className="flex min-h-0 flex-1 flex-col">
                          <SlideshowBlock blockType="slideshow" gallery={project.gallery} unboxed />
                        </div>
                      </div>
                    ) : null}
                    <div className="flex flex-col gap-8 p-6 md:p-8">
                      {title ? (
                        <h2 className="font-mono text-2xl font-bold text-black md:text-3xl">
                          {title}
                        </h2>
                      ) : null}
                      {typeof project.year === 'number' || participants ? (
                        <table className="w-full max-w-prose border-separate border-spacing-0 font-mono text-sm lg:text-lg">
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
