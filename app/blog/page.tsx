import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — CannaShield',
  description:
    'Cannabis cyber intel, breach analysis, compliance notes, and operator-ready security guidance from CannaShield.',
}

const plannedPosts = [
  'The 2025 STIIIZY Breach: What Cannabis Operators Need to Know Now',
  'Illinois Is the Only State Mandating MFA for Cannabis — Is Yours Next?',
  'BEC in Cannabis: How MariMed Lost $650K and What Stops It',
]

export default function BlogPage() {
  return (
    <section className="section-shell pt-32 sm:pt-40">
      <p className="section-label">RESOURCES</p>
      <h1 className="section-heading">Cannabis cyber intel, decoded.</h1>
      <p className="support-copy mt-6 max-w-2xl">
        The MDX scaffold is ready. No production posts are published in v1.
      </p>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plannedPosts.map((post) => (
          <article
            key={post}
            className="rounded-lg border border-brand-border bg-brand-surface p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
              Planned
            </p>
            <h2 className="mt-5 text-xl font-semibold leading-snug text-brand-primary">
              {post}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-secondary">
              This briefing will publish through the MDX blog pipeline.
            </p>
          </article>
        ))}
      </div>
      <Link
        href="/#resources"
        className="focus-ring mt-10 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
      >
        Subscribe to the Cannabis Cyber Brief →
      </Link>
    </section>
  )
}
