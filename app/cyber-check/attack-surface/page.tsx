import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AttackSurfaceForm } from '@/components/AttackSurfaceForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { attackSurfaceJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Free Cannabis Attack Surface Snapshot',
  description:
    'Free passive attack-surface scan for cannabis operators. Check open ports, exposed subdomains, breach history, email spoofing, and security headers — see what attackers already know about your domain.',
  alternates: { canonical: '/cyber-check/attack-surface' },
  openGraph: {
    title: 'Free Attack Surface Snapshot | CannaShield',
    description:
      'See what Shodan, certificate logs, and breach databases already know about your business — in 60 seconds, no account needed.',
    url: '/cyber-check/attack-surface',
    images: ['/og-image.png'],
  },
}

export default function AttackSurfacePage() {
  return (
    <>
      <JsonLd id="attack-surface-jsonld" data={attackSurfaceJsonLd()} />
      <section className="pt-32 sm:pt-40">
        <div className="container grid gap-10 pb-20 lg:grid-cols-[0.95fr_1fr] lg:items-start">
          <div>
            <p className="section-label">FREE ATTACK SURFACE SNAPSHOT</p>
            <h1 className="font-serif text-[42px] font-semibold leading-headline text-brand-primary sm:text-6xl">
              See what attackers already know.
            </h1>
            <p className="support-copy mt-6 max-w-2xl">
              Enter your domain. We run passive recon across five public data sources —
              open ports, exposed subdomains, breach history, email spoofing exposure,
              and web security headers — and return a scored risk snapshot. No intrusive
              scanning, no account, about 60 seconds.
            </p>
            <div className="mt-8 grid gap-3 text-sm leading-relaxed text-brand-secondary sm:grid-cols-2">
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Uses only publicly observable data — Shodan InternetDB, certificate
                transparency logs, the public breach directory, DNS, and HTTP headers.
              </div>
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Built for cannabis operators: the same exposures behind the STIIIZY,
                Trulieve, and MariMed incidents start with what&apos;s public.
              </div>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-brand-secondary">
                Loading the snapshot tool.
              </div>
            }
          >
            <AttackSurfaceForm />
          </Suspense>
        </div>
      </section>
      <section className="section-shell pt-0">
        <p className="section-label">ATTACK SURFACE FAQ</p>
        <h2 className="section-heading">What the snapshot checks.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What does the Attack Surface Snapshot check?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Five public data sources: open ports and services (Shodan InternetDB),
              exposed subdomains (certificate transparency logs), known breach history
              (the public breach directory), email spoofing exposure (SPF, DMARC, DKIM,
              MX), and HTTP security headers (HSTS, CSP, X-Frame-Options, and more). It
              returns a 0–100 risk score, finding cards, and prioritized recommendations.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              Is this an intrusive scan?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              No. The snapshot is fully passive — it only reads data that is already
              public. It never sends traffic that probes, logs into, or stresses your
              systems, so it is safe to run against your production domain.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              Is the Attack Surface Snapshot free?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Yes. CannaShield provides the snapshot as a free first look for cannabis
              business domains. It does not replace a full vCISO assessment, which reviews
              internal posture passive recon can&apos;t see.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What happens after the scan?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              You get your scored snapshot on screen immediately. Critical findings — like
              an exposed RDP port, a spoofable domain, or a known breach — map directly to
              CannaShield&apos;s Downtime Prevention and License Protection services.
            </p>
          </details>
        </div>
      </section>
    </>
  )
}
