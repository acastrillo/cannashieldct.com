import dns from 'node:dns/promises'
import tls from 'node:tls'
import { NextRequest, NextResponse } from 'next/server'

import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || ''
const WAITLIST_URL = 'https://automations.cannashieldct.com/webhook/waitlist'

const COMMON_SUBDOMAINS = [
  'www', 'mail', 'vpn', 'portal', 'admin',
  'dev', 'staging', 'api', 'app', 'owa',
]

// --- domain helpers ---

function normalizeDomain(value: string): string {
  let domain = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')
  if (domain.includes('@')) domain = domain.split('@').pop() ?? ''
  return domain.replace(/[^a-z0-9.-]/g, '').replace(/^\.+|\.+$/g, '')
}

function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253 || !domain.includes('.')) return false
  return domain.split('.').every(
    (label) =>
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label),
  )
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

// --- turnstile ---

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

// --- DNS ---

type DnsResult = {
  nsCount: number
  hasCAA: boolean
  danglingCnames: string[]
  status: 'pass' | 'warn' | 'fail'
  message: string
  score: number
}

async function isDanglingCname(subdomain: string, domain: string): Promise<string | null> {
  const fqdn = `${subdomain}.${domain}`
  try {
    const cnames = await dns.resolveCname(fqdn)
    if (!cnames.length) return null
    for (const cname of cnames) {
      try { await dns.resolve4(cname); return null } catch {}
      try { await dns.resolve6(cname); return null } catch {}
    }
    return fqdn
  } catch {
    return null
  }
}

async function checkDns(domain: string): Promise<DnsResult> {
  const [nsRecords, caaRecords, danglingResults] = await Promise.all([
    dns.resolveNs(domain).catch(() => [] as string[]),
    dns.resolveCaa(domain).catch(() => []),
    Promise.all(COMMON_SUBDOMAINS.map((sub) => isDanglingCname(sub, domain))),
  ])

  const nsCount = nsRecords.length
  const hasCAA = caaRecords.length > 0
  const danglingCnames = danglingResults.filter((r): r is string => r !== null)

  let score = 0
  if (nsCount > 0) score += 5
  if (hasCAA) score += 10
  if (danglingCnames.length === 0) score += 10

  const issues: string[] = []
  if (!hasCAA) issues.push('No CAA record — any CA can issue certificates for this domain.')
  if (danglingCnames.length > 0) issues.push(`Dangling CNAMEs detected: ${danglingCnames.join(', ')}.`)

  const status: DnsResult['status'] =
    score >= 20 ? 'pass' : score >= 10 ? 'warn' : 'fail'

  const message = issues.length
    ? issues.join(' ')
    : `NS records: ${nsCount}. CAA present. No dangling CNAMEs on common subdomains.`

  return { nsCount, hasCAA, danglingCnames, status, message, score }
}

// --- TLS ---

type TlsCertInfo = {
  status: 'valid' | 'expiring' | 'expired' | 'invalid' | 'error' | 'no-tls'
  issuer: string
  daysRemaining: number
  protocol: string
  sans: string[]
}

function connectTls(hostname: string): Promise<TlsCertInfo> {
  return new Promise((resolve) => {
    const errorResult: TlsCertInfo = {
      status: 'no-tls', issuer: '', daysRemaining: 0, protocol: '', sans: [],
    }

    const socket = tls.connect({
      host: hostname,
      port: 443,
      servername: hostname,
      rejectUnauthorized: false,
    })

    const timerId = setTimeout(() => {
      socket.destroy()
      resolve({ ...errorResult, status: 'error' })
    }, 5000)

    socket.once('secureConnect', () => {
      clearTimeout(timerId)
      try {
        const cert = socket.getPeerCertificate()
        const protocol = socket.getProtocol() ?? ''
        const authorized = socket.authorized
        socket.destroy()

        if (!cert || !cert.valid_to) {
          resolve({ ...errorResult, status: 'error', protocol })
          return
        }

        const rawIssuer = cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown CA'
        const issuer: string = Array.isArray(rawIssuer)
          ? (rawIssuer[0] ?? 'Unknown CA')
          : rawIssuer
        const validTo = new Date(cert.valid_to)
        const daysRemaining = isNaN(validTo.getTime())
          ? 0
          : Math.floor((validTo.getTime() - Date.now()) / 86_400_000)

        const sans = cert.subjectaltname
          ? cert.subjectaltname
              .split(', ')
              .flatMap((s) => {
                const m = s.match(/^DNS:(.+)/)
                return m ? [m[1]] : []
              })
          : []

        let status: TlsCertInfo['status']
        if (!authorized && daysRemaining < 0) status = 'expired'
        else if (!authorized) status = 'invalid'
        else if (daysRemaining < 30) status = 'expiring'
        else status = 'valid'

        resolve({ status, issuer, daysRemaining, protocol, sans })
      } catch {
        socket.destroy()
        resolve({ ...errorResult, status: 'error' })
      }
    })

    socket.on('error', () => {
      clearTimeout(timerId)
      resolve(errorResult)
    })
  })
}

type TlsResult = {
  apex: TlsCertInfo
  www: TlsCertInfo
  status: 'pass' | 'warn' | 'fail' | 'error'
  message: string
  score: number
}

async function checkTls(domain: string): Promise<TlsResult> {
  const [apex, www] = await Promise.all([
    connectTls(domain),
    connectTls(`www.${domain}`),
  ])

  const primary = apex.status !== 'no-tls' && apex.status !== 'error' ? apex : www

  let score = 0
  if (primary.status === 'valid') score += 10
  if (primary.daysRemaining > 90) score += 10
  else if (primary.daysRemaining > 30) score += 5
  if (primary.protocol === 'TLSv1.3') score += 10
  else if (primary.protocol === 'TLSv1.2') score += 7

  const issues: string[] = []
  if (primary.status === 'no-tls' || primary.status === 'error') {
    issues.push('HTTPS is unreachable or timed out — TLS could not be inspected.')
  } else if (primary.status === 'expired') {
    issues.push('Certificate has expired.')
  } else if (primary.status === 'expiring') {
    issues.push(`Certificate expires in ${primary.daysRemaining} days.`)
  } else if (primary.status === 'invalid') {
    issues.push('Certificate is not trusted (self-signed or CA mismatch).')
  }

  if (primary.protocol && primary.protocol !== 'TLSv1.3' && primary.protocol !== 'TLSv1.2') {
    issues.push(`Negotiated ${primary.protocol || 'unknown'} — upgrade to TLS 1.3.`)
  }

  const status: TlsResult['status'] =
    score >= 25 ? 'pass' : score >= 12 ? 'warn' : primary.status === 'no-tls' || primary.status === 'error' ? 'error' : 'fail'

  const message = issues.length
    ? issues.join(' ')
    : `Issued by ${primary.issuer}. Protocol: ${primary.protocol}. ${primary.daysRemaining} days remaining.`

  return { apex, www, status, message, score }
}

// --- HTTP headers ---

type HeadersResult = {
  present: string[]
  missing: string[]
  server: string | null
  xPoweredBy: string | null
  status: 'pass' | 'warn' | 'fail'
  message: string
  score: number
}

async function checkHeaders(domain: string): Promise<HeadersResult> {
  const SECURITY_HEADERS = [
    { key: 'strict-transport-security', label: 'HSTS', score: 10 },
    { key: 'content-security-policy', label: 'CSP', score: 8 },
    { key: 'x-frame-options', label: 'X-Frame-Options', score: 5 },
    { key: 'referrer-policy', label: 'Referrer-Policy', score: 4 },
    { key: 'permissions-policy', label: 'Permissions-Policy', score: 3 },
  ]

  const controller = new AbortController()
  const timerId = setTimeout(() => controller.abort(), 5000)

  let headerMap: Record<string, string | null> = {
    'strict-transport-security': null,
    'content-security-policy': null,
    'x-frame-options': null,
    'referrer-policy': null,
    'permissions-policy': null,
    server: null,
    'x-powered-by': null,
  }

  try {
    const res = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'CannaShield-AttackSurface/1.0' },
    })
    clearTimeout(timerId)
    for (const key of Object.keys(headerMap)) {
      headerMap[key] = res.headers.get(key)
    }
  } catch {
    clearTimeout(timerId)
  }

  const present: string[] = []
  const missing: string[] = []
  let score = 0

  for (const h of SECURITY_HEADERS) {
    if (headerMap[h.key]) {
      present.push(h.label)
      score += h.score
    } else {
      missing.push(h.label)
    }
  }

  const status: HeadersResult['status'] =
    score >= 25 ? 'pass' : score >= 12 ? 'warn' : 'fail'

  const message = missing.length
    ? `Missing: ${missing.join(', ')}.`
    : 'All major security headers are present.'

  return {
    present,
    missing,
    server: headerMap['server'],
    xPoweredBy: headerMap['x-powered-by'],
    status,
    message,
    score,
  }
}

// --- hosting fingerprint ---

type HostingResult = {
  ips: string[]
  ptr: string
  provider: string
  status: 'info'
  message: string
  score: number
}

function identifyProvider(ptr: string): string {
  const lower = ptr.toLowerCase()
  if (lower.includes('cloudflare')) return 'Cloudflare'
  if (lower.includes('cloudfront') || lower.includes('amazonaws')) return 'Amazon AWS'
  if (lower.includes('google') || lower.includes('1e100')) return 'Google Cloud'
  if (lower.includes('azure') || lower.includes('microsoft')) return 'Microsoft Azure'
  if (lower.includes('fastly')) return 'Fastly'
  if (lower.includes('akamai')) return 'Akamai'
  if (lower.includes('digitalocean')) return 'DigitalOcean'
  if (lower.includes('linode')) return 'Linode'
  if (lower.includes('vultr')) return 'Vultr'
  if (lower.includes('hetzner')) return 'Hetzner'
  if (lower.includes('ovh')) return 'OVH'
  if (ptr) return 'Identified via PTR'
  return 'Unknown provider'
}

async function checkHosting(domain: string): Promise<HostingResult> {
  let ips: string[] = []
  let ptr = ''
  let score = 0

  try {
    ips = await dns.resolve4(domain)
  } catch {
    try {
      ips = await dns.resolve6(domain)
    } catch {
      return { ips: [], ptr: '', provider: 'Could not resolve domain', status: 'info', message: 'Domain did not resolve to any IP address.', score: 0 }
    }
  }

  if (ips.length > 0) {
    score += 5
    try {
      const ptrs = await dns.reverse(ips[0])
      ptr = ptrs[0] || ''
      if (ptr) score += 5
    } catch {}
  }

  const provider = identifyProvider(ptr)
  const message = ptr
    ? `${ips[0]} → ${ptr} (${provider})`
    : ips.length > 0
      ? `Resolved to ${ips[0]}. No reverse DNS. Provider: ${provider}.`
      : 'Could not resolve domain.'

  return { ips, ptr, provider, status: 'info', message, score }
}

// --- scoring ---

function riskTier(score: number): string {
  if (score < 45) return 'Critical'
  if (score < 70) return 'High'
  if (score < 85) return 'Moderate'
  return 'Low'
}

function buildRecommendations(
  dnsResult: DnsResult,
  tlsResult: TlsResult,
  headersResult: HeadersResult,
): string[] {
  const recs: string[] = []

  if (!dnsResult.hasCAA) {
    recs.push('Add a CAA DNS record to restrict which certificate authorities can issue certs for your domain — this is a free, 15-minute fix.')
  }
  if (dnsResult.danglingCnames.length > 0) {
    recs.push(`Remove or reclaim dangling CNAME records on: ${dnsResult.danglingCnames.join(', ')} — these are live subdomain takeover candidates.`)
  }
  if (tlsResult.apex.status === 'expired' || tlsResult.apex.status === 'expiring') {
    recs.push(`TLS certificate expires in ${tlsResult.apex.daysRemaining} days. Renew now — an expired cert breaks trust with patients, regulators, and partners.`)
  }
  if (tlsResult.apex.status === 'no-tls' || tlsResult.apex.status === 'error') {
    recs.push('HTTPS is unreachable on the apex domain. Verify your web server is listening on port 443 with a valid certificate.')
  }
  if (headersResult.missing.includes('HSTS')) {
    recs.push('Add a Strict-Transport-Security (HSTS) header to force HTTPS connections and prevent protocol downgrade attacks.')
  }
  if (headersResult.missing.includes('CSP')) {
    recs.push('Implement a Content-Security-Policy header to reduce cross-site scripting exposure — a common attack entry point for cannabis operator portals.')
  }
  if (headersResult.missing.includes('X-Frame-Options')) {
    recs.push('Add X-Frame-Options to prevent clickjacking — attackers can overlay your login page inside an invisible iframe.')
  }
  if (headersResult.xPoweredBy) {
    recs.push(`Remove the X-Powered-By response header (currently disclosing: ${headersResult.xPoweredBy}) — stack disclosure helps attackers target known CVEs.`)
  }

  recs.push('For cannabis operators: periodically verify no business-critical subdomains have been abandoned — attackers monitor expiring cloud resources for subdomain takeover opportunities.')

  return recs.slice(0, 5)
}

// --- main analysis ---

async function analyzeAttackSurface(domain: string) {
  const [dnsResult, tlsResult, headersResult, hostingResult] = await Promise.all([
    checkDns(domain),
    checkTls(domain),
    checkHeaders(domain),
    checkHosting(domain),
  ])

  const score = Math.min(
    100,
    dnsResult.score + tlsResult.score + headersResult.score + hostingResult.score,
  )

  return {
    domain,
    score,
    riskTier: riskTier(score),
    checks: {
      dns: dnsResult,
      tls: tlsResult,
      headers: headersResult,
      hosting: hostingResult,
    },
    recommendations: buildRecommendations(dnsResult, tlsResult, headersResult),
  }
}

// --- route handler ---

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

  let body: Record<string, string>
  try {
    body = (await request.json()) as Record<string, string>
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Submit a valid request.' },
      { status: 400 },
    )
  }

  const domain = normalizeDomain(body.domain ?? '')
  const email = String(body.email ?? '').trim().toLowerCase()

  if (!isValidDomain(domain)) {
    return NextResponse.json(
      { ok: false, error: 'Enter a valid business domain (e.g. yourdispensary.com).' },
      { status: 400 },
    )
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: 'Enter a valid email address.' },
      { status: 400 },
    )
  }

  const tsOk = await verifyTurnstile(body.turnstileToken ?? '', ip)
  if (!tsOk) {
    return NextResponse.json(
      { ok: false, error: 'Verification failed. Complete the challenge and try again.' },
      { status: 403 },
    )
  }

  const analysis = await analyzeAttackSurface(domain)

  fetch(WAITLIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'attack-surface', email, domain }),
  }).catch(() => {})

  return NextResponse.json({ ok: true, analysis })
}
