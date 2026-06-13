import { NextRequest, NextResponse } from 'next/server'

import { checkRateLimit } from '@/lib/rate-limit'
// Scan engine is shared CJS (native dns/fetch only — no puppeteer). See
// lib/attack-surface-scan.js. allowJs in tsconfig lets us import it directly.
import {
  runScan,
  normalizeDomain,
  isValidDomain,
  isValidEmail,
} from '@/lib/attack-surface-scan'

export const runtime = 'nodejs'
// crt.sh can take up to ~12s; the full parallel scan stays well under this.
export const maxDuration = 30

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || ''
const LEAD_WEBHOOK_URL =
  process.env.N8N_ATTACK_SURFACE_WEBHOOK_URL ||
  'https://automations.cannashieldct.com/webhook/waitlist'

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  // No secret configured → don't block (rate limiting still applies).
  if (!TURNSTILE_SECRET) return true
  if (!token) return false
  const params = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token })
  if (ip && ip !== '0.0.0.0') params.set('remoteip', ip)
  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: params,
      },
    )
    const body = (await res.json()) as { success?: boolean }
    return Boolean(body.success)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0'

  const rl = checkRateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many scans from this network. Try again in an hour.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Submit a valid request.' },
      { status: 400 },
    )
  }

  const domain = normalizeDomain(body.domain || body.email)
  const email = String(body.email ?? '').trim().toLowerCase()

  if (!isValidDomain(domain)) {
    return NextResponse.json(
      { ok: false, error: 'Enter a valid business domain.' },
      { status: 400 },
    )
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: 'Enter a valid email address.' },
      { status: 400 },
    )
  }

  const turnstileOk = await verifyTurnstile(
    String(body.turnstileToken ?? ''),
    ip,
  )
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: 'Verification failed. Reload and try again.' },
      { status: 403 },
    )
  }

  let scan
  try {
    scan = await runScan(domain)
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'The scan could not complete. Try again in a minute.',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    )
  }

  // Lead capture — fire-and-forget, never blocks the result.
  void fetch(LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: 'attack-surface-snapshot',
      email,
      domain,
      score: scan.score,
      tier: scan.tier,
      submittedAt: scan.scannedAt,
    }),
  }).catch(() => {})

  return NextResponse.json({ ok: true, scan })
}
