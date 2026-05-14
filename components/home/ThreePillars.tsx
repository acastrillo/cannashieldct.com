import Link from 'next/link'

import { FadeIn } from '@/components/motion/FadeIn'
import { pillars } from '@/lib/constants'

export function ThreePillars() {
  return (
    <FadeIn as="section" className="section-shell">
      <p className="section-label">WHAT WE PROTECT</p>
      <h2 className="section-heading">Three reasons cannabis operators call us.</h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          return (
            <article
              key={pillar.title}
              className="group flex h-full flex-col rounded-lg border border-brand-border bg-brand-surface p-6 transition-colors hover:border-t-brand-accent"
            >
              <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-md border border-brand-border text-brand-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-brand-primary">
                {pillar.title}
              </h3>
              <p className="mt-5 text-base italic leading-relaxed text-brand-secondary">
                {pillar.pain}
              </p>
              <p className="mt-5 flex-1 text-base leading-relaxed text-brand-primary/90">
                {pillar.solution}
              </p>
              <Link
                href={pillar.href}
                className="focus-ring mt-8 w-fit rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
              >
                {pillar.cta}
              </Link>
            </article>
          )
        })}
      </div>
    </FadeIn>
  )
}
