'use client'

import { useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function CyberCheckForm() {
  const searchParams = useSearchParams()
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const requestedDomain = searchParams.get('domain')
    if (requestedDomain) {
      setDomain(requestedDomain)
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    try {
      await fetch('https://automations.cannashieldct.com/webhook/cyber-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          email,
          source: 'cyber-check-page',
        }),
      })
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
        <p className="text-lg font-semibold text-brand-primary">
          Your report is being generated. Check your email in 2–3 minutes.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-brand-border bg-brand-surface p-6"
    >
      <div className="grid gap-5">
        <div>
          <label
            htmlFor="cyber-check-domain"
            className="mb-2 block text-sm font-semibold text-brand-primary"
          >
            Domain
          </label>
          <Input
            id="cyber-check-domain"
            type="text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourdomain.com"
          />
        </div>
        <div>
          <label
            htmlFor="cyber-check-email"
            className="mb-2 block text-sm font-semibold text-brand-primary"
          >
            Email
          </label>
          <Input
            id="cyber-check-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Checking your domain...' : 'Run the scorecard →'}
        </Button>
        {error ? (
          <p className="text-sm text-brand-primary">
            Try again or email alex@cannashieldct.com.
          </p>
        ) : null}
      </div>
    </form>
  )
}
