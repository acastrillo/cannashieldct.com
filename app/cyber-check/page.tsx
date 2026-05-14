import type { Metadata } from 'next'
import { Suspense } from 'react'

import { CyberCheckForm } from '@/components/CyberCheckForm'

export const metadata: Metadata = {
  title: 'Email Security Scorecard — CannaShield',
  description:
    'Check DMARC, SPF, DKIM, and MX configuration for your cannabis business domain.',
}

export default function CyberCheckPage() {
  return (
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
  )
}
