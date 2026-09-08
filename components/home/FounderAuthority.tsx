import Link from 'next/link'

import { FadeIn } from '@/components/motion/FadeIn'

const badges = [
  'SSCP (ISC2)',
  'Tines Expert Builder',
  'NIST CSF 2.0 mapped',
  'AWS Security Specialty — in progress',
  'Connecticut-based',
]

const founderCard = [
  'Incident response analyst II, national identity & security company (NYC)',
  'Responding to live security incidents since 2023',
  'SSCP (ISC2) and Tines Expert Builder certified',
  'AWS Security Specialty in progress',
  'Builds NIST CSF 2.0 mapped programs for single-site and multi-site operators',
  'Connecticut-based, remote-friendly',
]

export function FounderAuthority() {
  return (
    <FadeIn
      as="section"
      id="why-cannashield"
      className="border-y border-brand-border bg-brand-surface/35"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative min-h-80 overflow-hidden rounded-lg border border-brand-border bg-gradient-to-br from-brand-surface via-brand-background to-brand-surface p-8">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
                Founder
              </p>
              <p className="mt-3 font-serif text-3xl font-semibold leading-tight text-brand-primary sm:text-4xl">
                Alex Castrillo
              </p>
              <p className="mt-2 text-sm text-brand-secondary">
                Cyber incident response analyst &middot; vCISO for Connecticut
                cannabis operators
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed text-brand-secondary">
              {founderCard.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-brand-accent">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <p className="section-label">WHY CANNASHIELD</p>
          <h2 className="section-heading">
            Built by someone who does this work on a weekday.
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-brand-secondary sm:text-lg">
            <p>
              Alex Castrillo runs incident response in-house for a national
              identity and security company in New York City. Since 2023
              that&apos;s meant live alerts, real evidence questions, and the
              part nobody puts in a brochure: deciding what actually happened
              and who needs to be told.
            </p>
            <p>
              CannaShield is that same discipline, sized for a licensed
              operator. A written security program. Evidence you can hand to
              a regulator, an underwriter, or an acquirer without a scramble.
              A decision path for the day the POS stops syncing and
              nobody&apos;s sure whether customer data moved.
            </p>
            <p>
              He hasn&apos;t worked a cannabis breach from the inside, and he
              won&apos;t claim otherwise. What he&apos;s done is read the
              STIIIZY notices the way an analyst reads them — vendor-caused,
              380,000 people, identity documents in scope — and build the
              controls and evidence that make that kind of failure survivable
              here.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-brand-primary">
            {badges.map((badge) => (
              <span key={badge}>· {badge}</span>
            ))}
          </div>
          <Link
            href="/about"
            className="focus-ring mt-8 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
          >
            Read the full background →
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}
