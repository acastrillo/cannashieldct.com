import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AttackSurfaceForm } from '@/components/AttackSurfaceForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { attackSurfaceJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Free Attack Surface Snapshot for Cannabis Businesses',
  description:
    'Free cannabis business attack surface scan. Check DNS hygiene, TLS posture, HTTP security headers, and hosting fingerprint — know what attackers can see about your domain in under 60 seconds.',
  alternates: { canonical: '/attack-surface' },
  openGraph: {
    title: 'Free Attack Surface Snapshot for Cannabis Businesses | CannaShield',
    description:
      'Check DNS hygiene, TLS posture, HTTP security headers, and hosting fingerprint — know what attackers can see about your domain.',
    url: '/attack-surface',
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
              See What Attackers See
            </h1>
            <p className="support-copy mt-6 max-w-2xl">
              Enter your domain. We&apos;ll enumerate publicly-discoverable signals — DNS
              hygiene, TLS certificate health, missing HTTP security headers, and hosting
              fingerprint — and return a scored report with prioritized fixes.
            </p>
            <div className="mt-8 grid gap-3 text-sm leading-relaxed text-brand-secondary sm:grid-cols-2">
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Checks NS records, CAA presence, and dangling CNAMEs on 10 common
                subdomains — subdomain takeover is a real attack vector in cannabis.
              </div>
              <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
                Inspects TLS certificate validity, expiry, and protocol version on the apex
                and www, plus five critical HTTP security headers.
              </div>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-brand-secondary">
                Loading scan form.
              </div>
            }
          >
            <AttackSurfaceForm />
          </Suspense>
        </div>
      </section>
      <section className="section-shell pt-0">
        <p className="section-label">SNAPSHOT FAQ</p>
        <h2 className="section-heading">What the scan checks.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What does the Attack Surface Snapshot check?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              It checks DNS hygiene (NS records, CAA presence, dangling CNAMEs), TLS posture
              (certificate validity, expiry, protocol version), HTTP security headers (HSTS,
              CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy), and the hosting
              fingerprint (IP resolution, reverse DNS, server technology hints).
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              Is this scan free?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Yes. CannaShield provides the Attack Surface Snapshot as a free initial check for
              cannabis business domains. It uses only publicly-available DNS and HTTP data — no
              intrusive probing.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What is a dangling CNAME and why does it matter?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              A dangling CNAME points to a cloud resource (S3 bucket, GitHub Pages, Heroku app,
              etc.) that no longer exists. Attackers can claim that resource and serve content
              under your subdomain — a subdomain takeover. For cannabis operators, this can
              expose patient portals, admin panels, or brand pages to adversarial control.
            </p>
          </details>
          <details className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              What does a CAA record do?
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              A Certificate Authority Authorization (CAA) DNS record restricts which certificate
              authorities are permitted to issue TLS certificates for your domain. Without one,
              any CA can issue a certificate for your domain — a risk exploited in targeted
              phishing and MitM attacks.
            </p>
          </details>
        </div>
      </section>
    </>
  )
}
