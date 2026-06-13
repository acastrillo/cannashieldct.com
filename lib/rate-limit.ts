type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()
const LIMIT = 10
const WINDOW = 60 * 60 * 1000

export function checkRateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW })
    return { ok: true, remaining: LIMIT - 1 }
  }

  if (entry.count >= LIMIT) {
    return { ok: false, remaining: 0 }
  }

  entry.count += 1
  return { ok: true, remaining: LIMIT - entry.count }
}
