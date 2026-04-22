'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
}

export interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  className?: string
  amount?: number
  immediate?: boolean
  viewportMargin?: string
}

export function RevealOnScroll({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'none',
  distance = 30,
  className = '',
  amount = 0.3,
  immediate = false,
  viewportMargin = '0px',
}: RevealOnScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const directionOffset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }

  const rest = {
    opacity: 1,
    x: 0,
    y: 0,
  }

  const initial = prefersReducedMotion
    ? rest
    : {
        opacity: 0,
        ...directionOffset[direction],
      }

  const whileInView = rest

  const transition = prefersReducedMotion
    ? { duration: 0, delay: 0 }
    : {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1] as const,
      }

  if (immediate) {
    return (
      <motion.div
        initial={initial}
        animate={whileInView}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, amount, margin: viewportMargin }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const REVEAL_STAGGER_S = 0.06

export type RevealableBlockProps = {
  /** When set (layout / RenderBlocks), wraps the block in a fade-on-scroll reveal. Omit for nested or Rich Text usage. */
  revealStaggerIndex?: number
}

type BlockScrollRevealProps = {
  children: ReactNode
  revealStaggerIndex?: number
  className?: string
}

export function BlockScrollReveal({ children, revealStaggerIndex, className = '' }: BlockScrollRevealProps) {
  if (revealStaggerIndex === undefined) {
    return <>{children}</>
  }

  return (
    <RevealOnScroll
      className={['w-full', className].filter(Boolean).join(' ')}
      delay={revealStaggerIndex * REVEAL_STAGGER_S}
      direction="none"
      immediate={revealStaggerIndex === 0}
    >
      {children}
    </RevealOnScroll>
  )
}
