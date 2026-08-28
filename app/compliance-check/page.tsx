import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ComplianceCheckForm } from '@/components/ComplianceCheckForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { complianceCheckJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Free Connecticut Cannabis Security Readiness Check',
  description:
    'Free Connecticut cannabis security-readiness check. Review eight practical controls and identify gaps before license renewal, insurance underwriting, or counsel review.',
  alternates: { canonical: '/compliance-check' },
  openGraph: {
    title: 'Free Cannabis Compliance Quick-Check | CannaShield',
    description:
      'A Connecticut-focused review of practical security controls for licensed cannabis operators.',
    url: '/compliance-check',
  },
}

export default function ComplianceCheckPage() {
  return (
    <>
      <JsonLd id="compliance-check-jsonld" data={complianceCheckJsonLd()} />
      <section className="pt-32 sm:pt-40">
        <div className="container grid gap-10 pb-20 lg:grid-cols-[0.95fr_1fr] lg:items-start">
          <div>
            <p className="section-label">FREE COMPLIANCE QUICK-CHECK</p>
            <h1 className="font-serif text-[42px] font-semibold leading-headline text-brand-primary sm:text-6xl">
              Connecticut Cannabis Security Readiness
            </h1>
            <p className="support-copy mt-6 max-w-2xl">
              Tell us your Connecticut operator type and which security controls you have
              today. You&apos;ll receive a practical readiness score grounded in Connecticut
              data-protection obligations and established security guidance. Takes 60 seconds.
            </p>
            <div className="mt-8 grid gap-3 text-sm leading-relaxed text-brand-secondary sm:grid-cols-2">
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Built for Connecticut dispensaries, cultivators, processors,
                manufacturers, MSOs, and ancillary cannabis businesses.
              </div>
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Separates Connecticut legal obligations from recommended safeguards.
                This is security-readiness guidance, not legal advice.
              </div>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-brand-secondary">
                Loading compliance check form.
              </div>
            }
          >
            <ComplianceCheckForm />
          </Suspense>
        </div>
      </section>
      <section className="section-shell pt-0">
        <p className="section-label">COMPLIANCE FAQ</p>
        <h2 className="section-heading">Cyber compliance for cannabis operators.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What does the compliance check assess?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              It reviews eight practical controls: MFA on email and POS, endpoint
              protection, a written security program, vendor risk, incident response,
              training, and tested encrypted backups. Weighting reflects operational risk,
              not a claim that every control is expressly mandated by Connecticut cannabis rules.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              Is this tool free?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Yes. CannaShield provides the Compliance Quick-Check as a free initial gap
              analysis for cannabis operators. It is not a legal assessment and does not
              replace qualified legal counsel.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              Which Connecticut laws inform this check?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Connecticut General Statutes § 42-471 requires organizations that possess
              another person&apos;s personal information to safeguard it from misuse. Section
              36a-701b establishes breach-notification duties, and the CTDPA adds obligations
              for covered controllers. Applicability depends on your data and business model.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What happens after the check?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Your results include a pass/gap badge per control and a Connecticut-specific note.
              Critical gaps link to CannaShield&apos;s License Protection service, which builds
              a written security program, vendor register, and incident response plan —
              documented for renewal, insurance, and counsel review.
            </p>
          </details>
        </div>
        <div className="mt-8 rounded-lg border border-brand-border bg-brand-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
            Official Connecticut sources
          </p>
          <ul className="mt-4 grid gap-3 text-sm font-semibold text-brand-accent">
            <li>
              <a
                href="https://www.cga.ct.gov/current/pub/chap_743dd.htm"
                rel="noopener noreferrer"
                className="focus-ring rounded-sm hover:text-brand-accent-hover"
              >
                Conn. Gen. Stat. § 42-471 — safeguarding personal information ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.cga.ct.gov/current/pub/chap_669.htm#sec_36a-701b"
                rel="noopener noreferrer"
                className="focus-ring rounded-sm hover:text-brand-accent-hover"
              >
                Conn. Gen. Stat. § 36a-701b — breach notification ↗
              </a>
            </li>
            <li>
              <a
                href="https://portal.ct.gov/ag/sections/privacy/the-connecticut-data-privacy-act"
                rel="noopener noreferrer"
                className="focus-ring rounded-sm hover:text-brand-accent-hover"
              >
                Connecticut Attorney General — CTDPA guidance ↗
              </a>
            </li>
            <li>
              <a
                href="https://portal.ct.gov/cannabis/knowledge-base/articles/policies-and-procedures"
                rel="noopener noreferrer"
                className="focus-ring rounded-sm hover:text-brand-accent-hover"
              >
                Connecticut DCP — cannabis policies and procedures ↗
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
