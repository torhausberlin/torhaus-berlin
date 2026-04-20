'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from '@/i18n/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const router = useRouter()
  const t = useTranslations('Pagination')

  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              aria-label={t('previous')}
              className={cn('gap-1 pl-2.5', !hasPrevPage && 'pointer-events-none opacity-50')}
              disabled={!hasPrevPage}
              size="default"
              onClick={() => {
                router.push(`/posts/page/${page - 1}`)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t('previous')}</span>
            </PaginationLink>
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(`/posts/page/${page - 1}`)
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                router.push(`/posts/page/${page}`)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(`/posts/page/${page + 1}`)
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              aria-label={t('next')}
              className={cn('gap-1 pr-2.5', !hasNextPage && 'pointer-events-none opacity-50')}
              disabled={!hasNextPage}
              size="default"
              onClick={() => {
                router.push(`/posts/page/${page + 1}`)
              }}
            >
              <span>{t('next')}</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
