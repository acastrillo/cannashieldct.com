'use client'

import Link from 'next/link'
import Script from 'next/script'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ALL_CONTROL_IDS, OPERATOR_TYPES } from '@/lib/compliance'
import type { ControlId, ControlResult } from '@/lib/compliance'

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

const SUPPORTED_STATES = ['CT', 'NY', 'MA', 'IL', 'CA'] as const
type SupportedState = (typeof SUPPORTED_STATES)[number]

const STATE_LABELS: Record<SupportedState, string> = {
  CT: 'Connecticut',
  NY: 'New York',
  MA: 'Massachusetts',
  IL: 'Illinois',
  CA: 'California',
}

const CONTROL_LABELS: Record<ControlId, string> = {
  'mfa-email': 'MFA on email',
  'mfa-pos': 'MFA on POS',
  'edr-endpoints': 'EDR on endpoints',
  'written-isp': 'Written information security program',
  'vendor-risk': 'Vendor risk register',
  'ir-plan': 'IR plan documented',
  'security-training': 'Annual security awareness training',
  'encrypted-backups': 'Encrypted backups tested in last 12 months',
}

type ComplianceResult = {
  state: string
  operatorType: string
  score: number
  readinessBadge: string
  controlResults: ControlResult[]
  statuteNote: string
}

const selectClass =
  'focus-ring flex h-12 w-full rounded-md border border-brand-border bg-brand-background px-4 py-3 text-base text-brand-primary disabled:cursor-not-allowed disabled:opacity-50'

export function ComplianceCheckForm() {
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const [state, setState] = useState<SupportedState | ''>('')
  const [operatorType, setOperatorType] = useState('')
  const [controls, setControls] = useState<ControlId[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [result, setResult] = useState<ComplianceResult | null>(null)

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

  const toggleControl = (id: ControlId) => {
    setControls((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!state) { setError('Select your state.'); return }
    if (!operatorType) { setError('Select your operator type.'); return }
    if (turnstileSiteKey && !turnstileToken) {
      setError('Complete the verification check, then submit.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/compliance-check/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, operatorType, controls, email, turnstileToken }),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok || !body?.ok) {
        throw new Error(body?.error || 'The compliance check could not complete. Try again.')
      }
      setResult(body.result ?? null)
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

  if (submitted && result) {
    const criticalGaps = result.controlResults.filter((c) => c.criticalGap)
    const gaps = result.controlResults.filter((c) => !c.present)
    const present = result.controlResults.filter((c) => c.present)

    return (
      <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Compliance check complete
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-primary">
              {STATE_LABELS[result.state as SupportedState] ?? result.state} {result.operatorType} scored {result.score}/100.
            </p>
            <span className="mt-1 inline-flex rounded-sm border border-brand-border px-2 py-1 text-xs font-semibold uppercase text-brand-secondary">
              {result.readinessBadge}
            </span>
          </div>

          {result.controlResults.length ? (
            <div className="grid gap-2">
              {result.controlResults.map((control) => (
                <div
                  key={control.id}
                  className="rounded-md border border-brand-border bg-brand-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-brand-primary">{control.label}</p>
                    <span
                      className={`shrink-0 rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase ${
                        control.present
                          ? 'border-green-600/40 text-green-600'
                          : control.criticalGap
                            ? 'border-red-500/40 text-red-500'
                            : 'border-brand-border text-brand-secondary'
                      }`}
                    >
                      {control.present ? 'Pass' : control.criticalGap ? 'Critical Gap' : 'Gap'}
                    </span>
                  </div>
                  {!control.present ? (
                    <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
                      {control.gapNote}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="rounded-md border border-brand-border bg-brand-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
              State-specific note
            </p>
            <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
              {result.statuteNote}
            </p>
          </div>

          {(criticalGaps.length > 0 || gaps.length > 0) ? (
            <div className="rounded-md border border-brand-border bg-brand-surface p-4">
              <p className="text-sm font-semibold text-brand-primary">
                Ready to close these gaps?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
                CannaShield&apos;s License Protection service builds the written security program,
                vendor risk register, and IR plan your state expects — documented and
                audit-ready.
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/services/license-protection">
                  See License Protection →
                </Link>
              </Button>
            </div>
          ) : null}

          <div className="text-xs leading-relaxed text-brand-secondary opacity-70">
            Controls present: {present.length}/{result.controlResults.length}. Score reflects weighted control coverage — not a legal determination. Consult qualified counsel for your state&apos;s specific requirements.
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setResult(null)
              turnstileWidgetId.current = null
              setSubmitted(false)
            }}
          >
            Run another check
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="compliance-state"
                className="mb-2 block text-sm font-semibold text-brand-primary"
              >
                State
              </label>
              <select
                id="compliance-state"
                required
                value={state}
                onChange={(e) => setState(e.target.value as SupportedState | '')}
                className={selectClass}
              >
                <option value="">Select state…</option>
                {SUPPORTED_STATES.map((s) => (
                  <option key={s} value={s}>
                    {STATE_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="compliance-operator"
                className="mb-2 block text-sm font-semibold text-brand-primary"
              >
                Operator type
              </label>
              <select
                id="compliance-operator"
                required
                value={operatorType}
                onChange={(e) => setOperatorType(e.target.value)}
                className={selectClass}
              >
                <option value="">Select type…</option>
                {OPERATOR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-brand-primary">
              Controls currently in place <span className="font-normal text-brand-secondary">(select all that apply)</span>
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALL_CONTROL_IDS.map((id) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-brand-border bg-brand-background p-3 text-sm leading-snug text-brand-secondary hover:border-brand-accent/40"
                >
                  <input
                    type="checkbox"
                    checked={controls.includes(id)}
                    onChange={() => toggleControl(id)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand-accent"
                  />
                  {CONTROL_LABELS[id]}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="compliance-email"
              className="mb-2 block text-sm font-semibold text-brand-primary"
            >
              Email
            </label>
            <Input
              id="compliance-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          {turnstileSiteKey ? <div ref={turnstileRef} className="min-h-[65px]" /> : null}

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Checking compliance...' : 'Run the compliance check →'}
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
