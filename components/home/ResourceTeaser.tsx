'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type ResourceTeaserPost = {
  tag: string
  title: string
  excerpt: string
  href: string
}

type ResourceTeaserProps = {
  posts: ResourceTeaserPost[]
}

export function ResourceTeaser({ posts }: ResourceTeaserProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(false)
    setSubmitting(true)

    try {
      const response = await fetch('https://automations.cannashieldct.com/webhook/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      })

      if (!response.ok) throw new Error('Newsletter subscription failed')

      setSubmitted(true)
      setEmail('')
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FadeIn as="section" id="resources" className="section-shell">
      <p className="section-label">RESOURCES</p>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="section-heading">Reviewed guidance for Connecticut operators.</h2>
          <p className="support-copy mt-5 max-w-2xl">
            Practical cybersecurity briefings, grounded in primary sources and written
            for Connecticut cannabis businesses.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full shrink-0 sm:w-auto">
          <Link href="/blog">Explore the Blog →</Link>
        </Button>
      </div>
      <article className="mt-10 grid gap-6 rounded-xl border border-brand-accent/40 bg-brand-surface p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
            Start here / 2026 operator guide
          </p>
          <h3 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
            Connecticut cannabis cybersecurity requirements, without the legal fog.
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-brand-secondary sm:text-base">
            The DCP reporting clocks, tracking-system controls, privacy rules, and
            evidence your team should have ready before an incident or inspection.
          </p>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link href="/resources/connecticut-cannabis-cybersecurity-requirements">
            Read the CT guide →
          </Link>
        </Button>
      </article>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-lg border border-brand-border bg-brand-surface p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
              {post.tag}
            </p>
            <h3 className="mt-5 text-xl font-semibold leading-snug text-brand-primary">
              {post.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-brand-secondary">
              {post.excerpt}
            </p>
            <Link
              href={post.href}
              className="focus-ring mt-7 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
            >
              Read →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-brand-border bg-brand-surface p-5 sm:p-6">
        {submitted ? (
          <p
            className="text-base font-semibold text-brand-primary"
            aria-live="polite"
          >
            You&apos;re subscribed to the monthly Cannabis Cyber Brief.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 lg:grid-cols-[1fr_minmax(280px,420px)_auto] lg:items-center"
          >
            <label
              htmlFor="newsletter-email"
              className="text-base font-semibold text-brand-primary"
            >
              Get the monthly Cannabis Cyber Brief.
            </label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com…"
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Subscribing…' : 'Subscribe'}
            </Button>
            {error ? (
              <p
                className="text-sm text-brand-primary lg:col-span-3"
                aria-live="polite"
              >
                Try again or email Alejo@cannashieldct.com.
              </p>
            ) : null}
          </form>
        )}
      </div>
    </FadeIn>
  )
}
