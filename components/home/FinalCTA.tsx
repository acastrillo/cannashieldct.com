'use client'

import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FinalCTA() {
  const [domain, setDomain] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cleanDomain = domain.trim()
    if (!cleanDomain) return
    window.location.href = `/cyber-check?domain=${encodeURIComponent(cleanDomain)}`
  }

  return (
    <section className="bg-brand-surface">
      <div className="container py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl font-semibold leading-headline text-brand-primary sm:text-5xl lg:text-6xl">
            Find out what&apos;s exposed in 90 seconds.
          </h2>
          <p className="support-copy mx-auto mt-5 max-w-xl">
            Free. No account. Just your domain.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-[1fr_auto]"
        >
          <Input
            type="text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourdomain.com"
            aria-label="Domain"
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Run the check →
          </Button>
        </form>
        <p className="mt-5 text-center text-sm leading-relaxed text-brand-secondary">
          · NIST CSF 2.0 Mapped · No account required · Results in 90 seconds
        </p>
      </div>
    </section>
  )
}
