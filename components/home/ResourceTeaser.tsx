'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const posts = [
  {
    tag: 'Supply Chain',
    title:
      'The supply chain does not end at your loading dock. It stretches into every line of code.',
    excerpt:
      'Why trusted digital infrastructure can become an operational risk for dispensaries and grows.',
    href: '/blog/the-supply-chain-doesn-t-end-at-your-loading-dock-it-stretches-into-ev-20260331132754',
  },
  {
    tag: 'Threat Intel',
    title:
      'The highest walls still have shadows when state-sponsored attackers break through.',
    excerpt:
      'What federal breach signals mean for operators who assume cannabis is too small to target.',
    href: '/blog/the-highest-walls-still-have-shadows-when-news-broke-that-state-sponso-20260330133559',
  },
  {
    tag: 'Mobile Risk',
    title:
      'The modern cannabis empire is run from an iPhone at 2 AM.',
    excerpt:
      'How mobile access, remote decisions, and always-on tools can threaten license-critical systems.',
    href: '/blog/the-modern-cannabis-empire-isn-t-run-from-a-boardroom-it-s-run-from-an-20260328181454',
  },
]

export function ResourceTeaser() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(false)

    try {
      await fetch('https://automations.cannashieldct.com/webhook/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      })
      setSubmitted(true)
      setEmail('')
    } catch {
      setError(true)
    }
  }

  return (
    <FadeIn as="section" id="resources" className="section-shell">
      <p className="section-label">RESOURCES</p>
      <h2 className="section-heading">Cannabis cyber intel, decoded.</h2>
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
          <p className="text-base font-semibold text-brand-primary">
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
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
            <Button type="submit">Subscribe</Button>
            {error ? (
              <p className="text-sm text-brand-primary lg:col-span-3">
                Try again or email Alejo@cannashieldct.com.
              </p>
            ) : null}
          </form>
        )}
      </div>
    </FadeIn>
  )
}
