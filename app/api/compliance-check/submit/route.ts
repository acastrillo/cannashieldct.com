import { NextRequest, NextResponse } from 'next/server'

import { checkRateLimit } from '@/lib/rate-limit'
import {
  ALL_CONTROL_IDS,
  OPERATOR_TYPES,
  STATE_RULESETS,
  scoreCompliance,
} from '@/lib/compliance'
import type { ControlId } from '@/lib/compliance'

export const runtime = 'nodejs'

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || ''
const WAITLIST_URL = 'https://automations.cannashieldct.com/webhook/waitlist'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true
  const params = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token })
  if (ip && ip !== '0.0.0.0') params.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: params,
    })
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
      { ok: false, error: 'Too many requests. Try again in an hour.' },
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

  const state = String(body.state ?? '').toUpperCase()
  const operatorType = String(body.operatorType ?? '')
  const email = String(body.email ?? '').trim().toLowerCase()
  const rawControls = Array.isArray(body.controls) ? (body.controls as unknown[]) : []
  const controls = rawControls
    .map((c) => String(c))
    .filter((c): c is ControlId => (ALL_CONTROL_IDS as string[]).includes(c))

  if (!STATE_RULESETS[state]) {
    return NextResponse.json(
      { ok: false, error: 'Select a supported state (CT, NY, MA, IL, CA).' },
      { status: 400 },
    )
  }
  if (!(OPERATOR_TYPES as readonly string[]).includes(operatorType)) {
    return NextResponse.json(
      { ok: false, error: 'Select a valid operator type.' },
      { status: 400 },
    )
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: 'Enter a valid email address.' },
      { status: 400 },
    )
  }

  const tsOk = await verifyTurnstile(String(body.turnstileToken ?? ''), ip)
  if (!tsOk) {
    return NextResponse.json(
      { ok: false, error: 'Verification failed. Complete the challenge and try again.' },
      { status: 403 },
    )
  }

  const ruleset = STATE_RULESETS[state]
  const result = scoreCompliance(ruleset, controls)

  fetch(WAITLIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'compliance-check', email, state, operatorType }),
  }).catch(() => {})

  return NextResponse.json({
    ok: true,
    result: {
      state,
      operatorType,
      score: result.score,
      readinessBadge: result.readinessBadge,
      controlResults: result.controlResults,
      statuteNote: ruleset.statuteNote,
    },
  })
}
