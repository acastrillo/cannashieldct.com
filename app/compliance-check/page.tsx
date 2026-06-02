import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ComplianceCheckForm } from '@/components/ComplianceCheckForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { complianceCheckJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Free Cannabis Compliance Quick-Check — CT, NY, MA, IL, CA',
  description:
    'Free cannabis cyber compliance gap analysis. See which security controls your state expects, get a readiness score, and identify critical gaps before your next license renewal or insurance underwriting.',
  alternates: { canonical: '/compliance-check' },
  openGraph: {
    title: 'Free Cannabis Compliance Quick-Check | CannaShield',
    description:
      'State-by-state gap analysis against your current cyber posture — CT, NY, MA, IL, CA. Know your gaps before renewal.',
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
              Cannabis Compliance Gap Analysis
            </h1>
            <p className="support-copy mt-6 max-w-2xl">
              Select your state and operator type, tell us which security controls you have
              today, and get a readiness score mapped against your state&apos;s cannabis
              cybersecurity expectations. Takes 60 seconds.
            </p>
            <div className="mt-8 grid gap-3 text-sm leading-relaxed text-brand-secondary sm:grid-cols-2">
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Covers Connecticut, New York, Massachusetts, Illinois, and California —
                mapped to each state&apos;s cannabis regulations and data-security statutes.
              </div>
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Illinois is the strictest: CRTA and PIPA explicitly require MFA and
                encryption. Your gaps here will surface at license renewal.
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
              It maps eight critical security controls against each state&apos;s cannabis
              regulations and data-security statutes — MFA on email, MFA on POS, EDR on
              endpoints, written ISP, vendor risk register, incident response plan, security
              training, and encrypted backups. Each control is weighted by criticality and
              state-specific legal requirements.
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
              Why is Illinois stricter than other states?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              The Illinois Cannabis Regulation and Tax Act (CRTA) and Personal Information
              Protection Act (PIPA) explicitly require licensees to implement multi-factor
              authentication for system access and encryption of all personal and financial
              data. These are among the most specific cybersecurity mandates in state cannabis
              law as of mid-2026.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What happens after the check?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Your results include a pass/gap badge per control and a state-specific note.
              Critical gaps link to CannaShield&apos;s License Protection service, which builds
              the written ISP, vendor register, and IR plan your state expects — documented
              and audit-ready before your next renewal.
            </p>
          </details>
        </div>
      </section>
    </>
  )
}
