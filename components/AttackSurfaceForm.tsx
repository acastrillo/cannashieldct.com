'use client'

import Script from 'next/script'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type TurnstileApi = {
  render: (
    container: string | HTMLElement,
    options: {
      sitekey: string
      theme?: 'auto' | 'dark' | 'light'
      callback?: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
    },
  ) => string
  reset: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type TlsCertInfo = {
  status: string
  issuer: string
  daysRemaining: number
  protocol: string
  sans: string[]
}

type AttackSurfaceAnalysis = {
  domain: string
  score: number
  riskTier: string
  checks: {
    dns: {
      nsCount: number
      hasCAA: boolean
      danglingCnames: string[]
      status: string
      message: string
      score: number
    }
    tls: {
      apex: TlsCertInfo
      www: TlsCertInfo
      status: string
      message: string
      score: number
    }
    headers: {
      present: string[]
      missing: string[]
      server: string | null
      xPoweredBy: string | null
      status: string
      message: string
      score: number
    }
    hosting: {
      ips: string[]
      ptr: string
      provider: string
      status: string
      message: string
      score: number
    }
  }
  recommendations: string[]
}

function statusBadge(status: string) {
  if (status === 'pass' || status === 'valid') return 'PASS'
  if (status === 'warn' || status === 'expiring' || status === 'invalid') return 'WARN'
  if (status === 'fail' || status === 'expired') return 'FAIL'
  if (status === 'error' || status === 'no-tls') return 'ERROR'
  return 'INFO'
}

export function AttackSurfaceForm() {
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [analysis, setAnalysis] = useState<AttackSurfaceAnalysis | null>(null)

  const renderTurnstile = useCallback(() => {
    if (!turnstileSiteKey || !turnstileRef.current || !window.turnstile || turnstileWidgetId.current) {
      return
    }
    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: turnstileSiteKey,
      theme: 'dark',
      callback: setTurnstileToken,
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => setTurnstileToken(''),
    })
  }, [])

  useEffect(() => {
    renderTurnstile()
  }, [renderTurnstile])

  useEffect(() => {
    if (!submitted) renderTurnstile()
  }, [submitted, renderTurnstile])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (turnstileSiteKey && !turnstileToken) {
      setError('Complete the verification check, then run the scan.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/attack-surface/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email, turnstileToken }),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok || !body?.ok) {
        throw new Error(body?.error || 'The scan could not complete. Try again.')
      }
      setAnalysis(body.analysis ?? null)
      setSubmitted(true)
      setTurnstileToken('')
      if (turnstileWidgetId.current) window.turnstile?.reset(turnstileWidgetId.current)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Try again or email alejo@cannashieldct.com.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted && analysis) {
    const { checks } = analysis
    const findingCards = [
      {
        label: 'DNS Hygiene',
        status: checks.dns.status,
        message: checks.dns.message,
        detail: checks.dns.danglingCnames.length
          ? `Dangling CNAMEs: ${checks.dns.danglingCnames.join(', ')}`
          : `NS records: ${checks.dns.nsCount}. CAA: ${checks.dns.hasCAA ? 'present' : 'missing'}.`,
      },
      {
        label: 'TLS Posture',
        status: checks.tls.status,
        message: checks.tls.message,
        detail: checks.tls.apex.status !== 'no-tls' && checks.tls.apex.status !== 'error'
          ? `Apex cert — Issued by: ${checks.tls.apex.issuer || 'Unknown'}. Protocol: ${checks.tls.apex.protocol || 'unknown'}. ${checks.tls.apex.daysRemaining} days remaining.`
          : 'Apex: HTTPS unreachable.',
      },
      {
        label: 'HTTP Security Headers',
        status: checks.headers.status,
        message: checks.headers.message,
        detail: checks.headers.present.length
          ? `Present: ${checks.headers.present.join(', ')}.`
          : 'No security headers detected.',
      },
      {
        label: 'Hosting & Tech Fingerprint',
        status: 'info',
        message: checks.hosting.message,
        detail: [
          checks.hosting.provider !== 'Unknown provider' && checks.hosting.provider !== 'Unknown' ? `Provider: ${checks.hosting.provider}.` : '',
          checks.headers.server ? `Server: ${checks.headers.server}.` : '',
          checks.headers.xPoweredBy ? `X-Powered-By: ${checks.headers.xPoweredBy} — consider removing this header.` : '',
        ]
          .filter(Boolean)
          .join(' ') || 'No tech fingerprint data available.',
      },
    ]

    return (
      <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Scan complete
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-primary">
              {analysis.domain} scored {analysis.score}/100.
            </p>
            <p className="mt-1 text-sm text-brand-secondary">
              Risk tier: {analysis.riskTier}
            </p>
          </div>

          <div className="grid gap-3">
            {findingCards.map((card) => (
              <div
                key={card.label}
                className="rounded-md border border-brand-border bg-brand-background p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-brand-primary">{card.label}</p>
                  <span className="rounded-sm border border-brand-border px-2 py-1 text-xs font-semibold uppercase text-brand-secondary">
                    {statusBadge(card.status)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
                  {card.message}
                </p>
                {card.detail && card.detail !== card.message ? (
                  <p className="mt-1 text-sm leading-relaxed text-brand-secondary opacity-80">
                    {card.detail}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {analysis.recommendations.length ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-brand-primary">
                Prioritized recommendations
              </p>
              <ol className="grid gap-2 text-sm leading-relaxed text-brand-secondary">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 font-semibold text-brand-accent">{i + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAnalysis(null)
              turnstileWidgetId.current = null
              setSubmitted(false)
            }}
          >
            Scan another domain
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-brand-border bg-brand-surface p-6"
      >
        <div className="grid gap-5">
          <div>
            <label
              htmlFor="attack-surface-domain"
              className="mb-2 block text-sm font-semibold text-brand-primary"
            >
              Domain
            </label>
            <Input
              id="attack-surface-domain"
              type="text"
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourdispensary.com"
            />
          </div>
          <div>
            <label
              htmlFor="attack-surface-email"
              className="mb-2 block text-sm font-semibold text-brand-primary"
            >
              Email
            </label>
            <Input
              id="attack-surface-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          {turnstileSiteKey ? <div ref={turnstileRef} className="min-h-[65px]" /> : null}
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Scanning your domain...' : 'Run the snapshot →'}
          </Button>
          {error ? (
            <p className="text-sm text-brand-primary">
              {error} Need help? Email alejo@cannashieldct.com.
            </p>
          ) : null}
        </div>
      </form>
    </>
  )
}
