import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { CyberCheckForm } from '@/components/CyberCheckForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { scorecardJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Free Email Security Scorecard for Cannabis Businesses',
  description:
    'Free cannabis business email security scorecard. Check DMARC, SPF, DKIM, MX, and spoofing exposure before attackers impersonate your domain.',
  alternates: { canonical: '/cyber-check' },
  openGraph: {
    title: 'Free Email Security Scorecard for Cannabis Businesses | CannaShield',
    description:
      'Check DMARC, SPF, DKIM, MX, and spoofing exposure before attackers impersonate your domain.',
    url: '/cyber-check',
    images: ['/og-image.png'],
  },
}

export default function CyberCheckPage() {
  return (
    <>
      <JsonLd id="scorecard-jsonld" data={scorecardJsonLd()} />
      <section className="pt-32 sm:pt-40">
        <div className="container grid gap-10 pb-20 lg:grid-cols-[0.95fr_1fr] lg:items-start">
          <div>
            <p className="section-label">FREE CYBER CHECK</p>
            <h1 className="font-serif text-[42px] font-semibold leading-headline text-brand-primary sm:text-6xl">
              Email Security Scorecard
            </h1>
            <p className="support-copy mt-6 max-w-2xl">
              Enter your domain. We&apos;ll check DMARC, SPF, DKIM, and MX
              configuration and tell you whether attackers can spoof your domain
              today.
            </p>
            <div className="mt-8 grid gap-3 text-sm leading-relaxed text-brand-secondary sm:grid-cols-2">
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Built for cannabis operators that rely on vendor email, POS
                notifications, payroll, compliance systems, and payment workflows.
              </div>
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Useful before cyber insurance renewals, vendor-risk reviews, and{' '}
                <Link
                  href="/blog/the-ai-illusion-why-your-ceo-just-ordered-a-wire-transfer-20260226170304"
                  className="focus-ring rounded-sm font-semibold text-brand-accent underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:text-brand-accent-hover"
                >
                  phishing-awareness conversations with finance teams
                </Link>
                .
              </div>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-brand-secondary">
                Loading scorecard form.
              </div>
            }
          >
            <CyberCheckForm />
          </Suspense>
        </div>
      </section>
      <section className="section-shell pt-0">
        <p className="section-label">SCORECARD FAQ</p>
        <h2 className="section-heading">Email authentication basics.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What does the Email Security Scorecard check?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              It checks DMARC, SPF, DKIM, MX, and domain spoofing signals for a
              business domain. Gaps in these same records are what let attackers
              impersonate a trusted sender — see how in our breakdown of{' '}
              <Link
                href="/blog/trusted-senders-false-invoices-the-dkim-replay-threat-20260219173723"
                className="focus-ring rounded-sm font-semibold text-brand-accent underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:text-brand-accent-hover"
              >
                the DKIM replay threat
              </Link>
              .
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              Is the scorecard free?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Yes. CannaShield provides the scorecard as a free initial check for
              business domains.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What should I do if my domain fails these checks?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              A failing DMARC, SPF, or DKIM record leaves your domain open to
              spoofing and vendor-invoice fraud. The{' '}
              <Link
                href="/services/downtime-prevention"
                className="focus-ring rounded-sm font-semibold text-brand-accent underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:text-brand-accent-hover"
              >
                BEC/Phishing Defense Sprint
              </Link>{' '}
              closes those gaps — email authentication, identity, and
              payment-verification controls in one scoped engagement.
            </p>
          </details>
        </div>
      </section>
    </>
  )
}
