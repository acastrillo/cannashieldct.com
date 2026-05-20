'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type WaitlistToolCardProps = {
  title: string
  description: string
  tool: string
}

function WaitlistToolCard({ title, description, tool }: WaitlistToolCardProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(false)

    try {
      await fetch('https://automations.cannashieldct.com/webhook/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, email }),
      })
      setSubmitted(true)
      setEmail('')
    } catch {
      setError(true)
    }
  }

  return (
    <article className="rounded-lg border border-brand-border bg-brand-surface p-6">
      <div className="mb-5 inline-flex rounded-full border border-brand-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
        COMING SOON
      </div>
      <h3 className="text-2xl font-semibold text-brand-primary">{title}</h3>
      <p className="mt-4 text-base leading-relaxed text-brand-secondary">
        {description}
      </p>
      {submitted ? (
        <p className="mt-6 rounded-md border border-brand-border bg-brand-background p-4 text-sm text-brand-primary">
          You&apos;re on the list.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label={`${title} waitlist email`}
          />
          <Button type="submit">Notify me when it&apos;s live →</Button>
          {error ? (
            <p className="text-sm text-brand-primary">
              Try again or email Alejo@cannashieldct.com.
            </p>
          ) : null}
        </form>
      )}
    </article>
  )
}

export function FreeTools() {
  return (
    <FadeIn as="section" id="free-tools" className="section-shell">
      <p className="section-label">START HERE — FREE</p>
      <h2 className="section-heading">
        Find out what&apos;s exposed before attackers do.
      </h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <article className="rounded-lg border border-brand-border bg-brand-surface p-6">
          <div className="mb-5 inline-flex rounded-full border border-brand-accent/40 px-3 py-1 text-xs font-semibold text-brand-accent">
            LIVE
          </div>
          <h3 className="text-2xl font-semibold text-brand-primary">
            Email Security Scorecard
          </h3>
          <p className="mt-4 text-base leading-relaxed text-brand-secondary">
            Enter your domain. Get a report on your DMARC, SPF, and DKIM
            configuration — and whether attackers can impersonate your brand in
            60 seconds.
          </p>
          <p className="mt-5 text-sm text-brand-secondary">
            Free · 90 seconds · No account needed
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/cyber-check">Check your domain →</Link>
          </Button>
        </article>

        <WaitlistToolCard
          title="Attack Surface Snapshot"
          description="See what Shodan, Censys, and breach databases know about your business right now."
          tool="attack-surface"
        />
        <WaitlistToolCard
          title="Cannabis Compliance Quick-Check"
          description="State-by-state gap analysis against your current cyber posture — CT, NY, MA, IL, CA."
          tool="compliance-check"
        />
      </div>
    </FadeIn>
  )
}
