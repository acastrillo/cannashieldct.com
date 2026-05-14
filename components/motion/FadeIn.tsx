'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type FadeInProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function FadeIn<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: FadeInProps<T>) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion.create(as || 'div') as ElementType

  if (prefersReducedMotion) {
    const StaticComponent = (as || 'div') as ElementType
    return (
      <StaticComponent className={className} {...props}>
        {children}
      </StaticComponent>
    )
  }

  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  )
}
