'use client'

import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADOwGi7QBbrMsNCJ'

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

type ScorecardCheck = {
  label: string
  status: string
  message: string
}

type ScorecardChecks = {
  dmarc?: {
    policy?: string
    status?: string
    warnings?: string[]
    hasReporting?: boolean
  }
  spf?: {
    status?: string
    allMechanism?: string | null
    lookupCount?: number
    warnings?: string[]
  }
  dkim?: {
    status?: string
    detectedSelectors?: string[]
    warnings?: string[]
  }
  mx?: {
    status?: string
    records?: string[]
  }
}

type SpoofScenario = {
  outcome?: string
  detail?: string
}

type ScorecardAnalysis = {
  domain: string
  score: number
  riskTier: string
  spoofScenario?: SpoofScenario
  checks?: ScorecardChecks
  recommendations?: string[]
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

function firstWarning(warnings?: string[]) {
  return warnings?.[0] || ''
}

function formatCheckCards(checks?: ScorecardChecks): ScorecardCheck[] {
  if (!checks) return []

  return [
    {
      label: 'DMARC',
      status: checks.dmarc?.status || 'unknown',
      message:
        firstWarning(checks.dmarc?.warnings) ||
        `Policy: ${checks.dmarc?.policy || 'unknown'}. Reporting ${
          checks.dmarc?.hasReporting ? 'is configured' : 'is not configured'
        }.`,
    },
    {
      label: 'SPF',
      status: checks.spf?.status || 'unknown',
      message:
        firstWarning(checks.spf?.warnings) ||
        `Mechanism: ${checks.spf?.allMechanism || 'not detected'}. DNS lookups: ${
          checks.spf?.lookupCount ?? 'unknown'
        }.`,
    },
    {
      label: 'DKIM',
      status: checks.dkim?.status || 'unknown',
      message:
        firstWarning(checks.dkim?.warnings) ||
        `Detected selectors: ${
          checks.dkim?.detectedSelectors?.length
            ? checks.dkim.detectedSelectors.join(', ')
            : 'none on common selectors'
        }.`,
    },
    {
      label: 'MX',
      status: checks.mx?.status || 'unknown',
      message: checks.mx?.records?.length
        ? `Mail exchangers: ${checks.mx.records.join(', ')}.`
        : 'No mail exchanger records were detected.',
    },
  ]
}

export function CyberCheckForm() {
  const searchParams = useSearchParams()
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [analysis, setAnalysis] = useState<ScorecardAnalysis | null>(null)

  const renderTurnstile = useCallback(() => {
    if (!turnstileRef.current || !window.turnstile || turnstileWidgetId.current) {
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
    const requestedDomain = searchParams.get('domain')
    if (requestedDomain) {
      setDomain(requestedDomain)
    }
  }, [searchParams])

  useEffect(() => {
    renderTurnstile()
  }, [renderTurnstile])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!turnstileToken) {
      setError('Complete the verification check, then run the scorecard.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/scorecard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          email,
          turnstileToken,
          consent: true,
          source: 'cyber-check-page',
        }),
      })

      const body = await response.json().catch(() => null)
      if (!response.ok || !body?.ok) {
        throw new Error(
          body?.error || 'The scorecard service could not process this request.',
        )
      }

      setAnalysis(body.analysis ?? null)
      setSubmitted(true)
      setTurnstileToken('')
      if (turnstileWidgetId.current) {
        window.turnstile?.reset(turnstileWidgetId.current)
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Try again or email alejo@cannashieldct.com.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    const checkCards = formatCheckCards(analysis?.checks)

    return (
      <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Scorecard complete
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-primary">
              {analysis?.domain
                ? `${analysis.domain} scored ${analysis.score}/100.`
                : 'Your report request was received.'}
            </p>
            {analysis?.riskTier ? (
              <p className="mt-1 text-sm text-brand-secondary">
                Risk tier: {analysis.riskTier}
              </p>
            ) : null}
          </div>

          {checkCards.length ? (
            <div className="grid gap-3">
              {checkCards.map((check) => (
                <div
                  key={check.label}
                  className="rounded-md border border-brand-border bg-brand-background p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-brand-primary">
                      {check.label}
                    </p>
                    <span className="rounded-sm border border-brand-border px-2 py-1 text-xs font-semibold uppercase text-brand-secondary">
                      {check.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
                    {check.message}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {analysis?.spoofScenario ? (
            <div className="rounded-md border border-brand-border bg-brand-background p-4">
              <p className="text-sm font-semibold text-brand-primary">
                {analysis.spoofScenario.outcome || 'Spoofing scenario'}
              </p>
              {analysis.spoofScenario.detail ? (
                <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
                  {analysis.spoofScenario.detail}
                </p>
              ) : null}
            </div>
          ) : null}

          {analysis?.recommendations?.length ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-brand-primary">
                Recommended next steps
              </p>
              <ul className="grid gap-2 text-sm leading-relaxed text-brand-secondary">
                {analysis.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              setAnalysis(null)
              renderTurnstile()
            }}
          >
            Run another scorecard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderTurnstile}
      />
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
          <div ref={turnstileRef} className="min-h-[65px]" />
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Checking your domain...' : 'Run the scorecard ->'}
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
