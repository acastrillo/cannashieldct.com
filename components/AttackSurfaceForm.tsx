'use client'

import { useSearchParams } from 'next/navigation'
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

type Scan = {
  domain: string
  scannedAt: string
  score: number
  tier: 'Low' | 'Medium' | 'High' | 'Critical'
  scoring: { score: number; breakdown: { reason: string; points: number }[] }
  recommendations: string[]
  recon: {
    shodan: {
      status: string
      ip: string | null
      openPorts: number[]
      highRiskPorts: { port: number; service: string; highPenalty: boolean }[]
    }
    certs: { status: string; count: number }
    hibp: { status: string; count: number }
    dns: {
      spf: { present: boolean; status?: string }
      dmarc: { present: boolean; policy?: string }
      dkim: { detected: boolean }
      mx: { present: boolean; records: string[] }
    }
    headers: { status: string; missingCount: number; missing: string[]; hasHsts: boolean }
  }
}

type Tone = 'pass' | 'warn' | 'fail' | 'muted' | 'neutral'

const toneClass: Record<Tone, string> = {
  pass: 'border-green-600/40 text-green-500',
  warn: 'border-brand-accent/40 text-brand-accent',
  fail: 'border-red-500/40 text-red-400',
  muted: 'border-brand-border text-brand-secondary',
  neutral: 'border-brand-border text-brand-primary',
}

const tierClass: Record<Scan['tier'], string> = {
  Low: 'text-green-500',
  Medium: 'text-brand-accent',
  High: 'text-orange-400',
  Critical: 'text-red-400',
}

type Card = { label: string; text: string; tone: Tone; note: string }

function buildCards(recon: Scan['recon']): Card[] {
  const { shodan, certs, hibp, dns, headers } = recon

  // Ports
  const highRisk = (shodan.highRiskPorts || []).filter((p) => p.highPenalty)
  const ports: Card =
    shodan.status === 'error'
      ? { label: 'Open ports', text: 'Unavailable', tone: 'muted', note: 'Port data unavailable.' }
      : highRisk.length
        ? {
            label: 'Open ports',
            text: highRisk.map((p) => `${p.service} (${p.port})`).join(', '),
            tone: 'fail',
            note: 'High-risk services exposed to the internet.',
          }
        : (shodan.openPorts || []).length === 0
          ? { label: 'Open ports', text: 'None detected', tone: 'pass', note: 'No exposed ports found.' }
          : {
              label: 'Open ports',
              text: `${shodan.openPorts.length} open`,
              tone: 'warn',
              note: `${shodan.openPorts.length} ports on ${shodan.ip ?? 'host'}.`,
            }

  // Subdomains
  const sub: Card =
    certs.status === 'error'
      ? { label: 'Subdomains', text: 'Unavailable', tone: 'muted', note: 'crt.sh query failed — retry later.' }
      : certs.count === 0
        ? { label: 'Subdomains', text: 'None found', tone: 'pass', note: 'No subdomains in cert logs.' }
        : certs.count > 10
          ? { label: 'Subdomains', text: `${certs.count} exposed`, tone: 'warn', note: 'From certificate transparency logs.' }
          : { label: 'Subdomains', text: `${certs.count} found`, tone: 'neutral', note: 'From certificate transparency logs.' }

  // Breach history
  const breach: Card =
    hibp.status === 'skipped'
      ? { label: 'Breach history', text: 'Skipped', tone: 'muted', note: 'Breach lookup unavailable.' }
      : hibp.status === 'error'
        ? { label: 'Breach history', text: 'Unavailable', tone: 'muted', note: 'Breach lookup failed.' }
        : hibp.count === 0
          ? { label: 'Breach history', text: 'None found', tone: 'pass', note: 'Domain not in public breach records.' }
          : {
              label: 'Breach history',
              text: `${hibp.count} breach${hibp.count > 1 ? 'es' : ''}`,
              tone: 'fail',
              note: 'Credential reuse is a real risk — rotate now.',
            }

  // Email auth
  const email: Card = !dns.dmarc.present
    ? {
        label: 'Email spoofing',
        text: 'No DMARC',
        tone: 'fail',
        note: dns.spf.present ? 'SPF set, but no DMARC — domain is spoofable.' : 'No SPF or DMARC — domain is spoofable.',
      }
    : dns.dmarc.policy === 'reject'
      ? { label: 'Email spoofing', text: 'DMARC reject', tone: 'pass', note: `SPF: ${dns.spf.status ?? 'n/a'}${dns.dkim.detected ? ' · DKIM detected' : ''}.` }
      : dns.dmarc.policy === 'quarantine'
        ? { label: 'Email spoofing', text: 'DMARC quarantine', tone: 'warn', note: 'Move to p=reject to fully block spoofing.' }
        : { label: 'Email spoofing', text: 'DMARC monitor', tone: 'warn', note: 'p=none only monitors — it does not block spoofing.' }

  // Security headers
  const hdr: Card =
    headers.status === 'error'
      ? { label: 'Security headers', text: 'Unavailable', tone: 'muted', note: 'Site was unreachable.' }
      : headers.missingCount === 0
        ? { label: 'Security headers', text: 'All present', tone: 'pass', note: 'All checked headers are set.' }
        : {
            label: 'Security headers',
            text: `${headers.missingCount} missing`,
            tone: headers.missingCount > 3 ? 'fail' : 'warn',
            note: headers.missing.join(', '),
          }

  return [ports, sub, breach, email, hdr]
}

export function AttackSurfaceForm() {
  const searchParams = useSearchParams()
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [scan, setScan] = useState<Scan | null>(null)

  const renderTurnstile = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !turnstileRef.current ||
      !window.turnstile ||
      turnstileWidgetId.current
    ) {
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
    const requested = searchParams.get('domain')
    if (requested) setDomain(requested)
  }, [searchParams])

  useEffect(() => {
    if (!scan) renderTurnstile()
  }, [scan, renderTurnstile])

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
      setScan(body.scan ?? null)
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

  if (scan) {
    const cards = buildCards(scan.recon)
    return (
      <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
        <div className="grid gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-border pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Snapshot complete
              </p>
              <p className="mt-2 text-lg font-semibold text-brand-primary">{scan.domain}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-brand-primary">
                {scan.score}
                <span className="ml-1 text-base font-medium text-brand-secondary">/ 100 risk</span>
              </p>
              <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${tierClass[scan.tier]}`}>
                {scan.tier} risk
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {cards.map((c) => (
              <div
                key={c.label}
                className="rounded-md border border-brand-border bg-brand-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-brand-primary">{c.label}</p>
                  <span
                    className={`shrink-0 rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase ${toneClass[c.tone]}`}
                  >
                    {c.text}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-secondary">{c.note}</p>
              </div>
            ))}
          </div>

          {scan.scoring.breakdown.length ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-brand-primary">What drove the score</p>
              <div className="flex flex-wrap gap-2">
                {scan.scoring.breakdown.map((b) => (
                  <span
                    key={b.reason}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-background px-3 py-1 text-xs text-brand-secondary"
                  >
                    {b.reason}
                    <span className="font-semibold text-brand-accent">+{b.points}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {scan.recommendations.length ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-brand-primary">Recommended next steps</p>
              <ul className="grid gap-2 text-sm leading-relaxed text-brand-secondary">
                {scan.recommendations.map((rec) => (
                  <li key={rec} className="rounded-md border border-brand-border bg-brand-background p-3">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-xs leading-relaxed text-brand-secondary opacity-70">
            Passive recon only — no intrusive scanning. Results reflect publicly observable data at
            scan time. A full vCISO assessment reviews internal posture this can&apos;t see.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setScan(null)
              turnstileWidgetId.current = null
            }}
          >
            Run another scan
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
              placeholder="yourdomain.com"
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
            {loading ? 'Scanning ports, certs, breaches, DNS…' : 'Run the snapshot →'}
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
