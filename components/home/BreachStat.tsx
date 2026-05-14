'use client'

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type BreachStatProps = {
  prefix?: string
  value: number
  suffix?: string
  label: string
}

export function BreachStat({ prefix = '', value, suffix = '', label }: BreachStatProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const motionValue = useMotionValue(prefersReducedMotion ? value : 0)
  const springValue = useSpring(motionValue, {
    stiffness: 70,
    damping: 18,
    mass: 0.8,
  })
  const [displayValue, setDisplayValue] = useState(
    `${prefix}${value.toLocaleString()}${suffix}`,
  )

  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(value)
      setDisplayValue(`${prefix}${value.toLocaleString()}${suffix}`)
      return
    }

    if (inView) {
      motionValue.set(value)
    }
  }, [inView, motionValue, prefix, prefersReducedMotion, suffix, value])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(`${prefix}${Math.round(latest).toLocaleString()}${suffix}`)
    })

    return unsubscribe
  }, [prefix, springValue, suffix])

  return (
    <motion.p ref={ref} className="text-2xl font-semibold text-brand-accent">
      <span>{displayValue}</span>{' '}
      <span className="text-base font-medium text-brand-accent">{label}</span>
    </motion.p>
  )
}
