import Link from 'next/link'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/button'
import { freeTools } from '@/lib/constants'

export function FreeTools() {
  return (
    <FadeIn as="section" id="free-tools" className="section-shell">
      <p className="section-label">START HERE — FREE</p>
      <h2 className="section-heading">
        Find out what&apos;s exposed before attackers do.
      </h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {freeTools.map((tool) => (
          <article
            key={tool.title}
            className="flex h-full flex-col rounded-lg border border-brand-border bg-brand-surface p-6"
          >
            <div className="mb-5 inline-flex w-fit rounded-full border border-brand-accent/40 px-3 py-1 text-xs font-semibold text-brand-accent">
              LIVE
            </div>
            <h3 className="text-2xl font-semibold text-brand-primary">{tool.title}</h3>
            <p className="mt-4 flex-1 text-base leading-relaxed text-brand-secondary">
              {tool.description}
            </p>
            <p className="mt-5 text-sm text-brand-secondary">{tool.meta}</p>
            <Button asChild className="mt-6 w-full">
              <Link href={tool.href}>{tool.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </FadeIn>
  )
}
