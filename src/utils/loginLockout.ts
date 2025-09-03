type Key = string

type AttemptState = {
  count: number
  firstAt: number
  lockUntil?: number
}

const attempts = new Map<Key, AttemptState>()

const MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS || 5)
const WINDOW_MS = Number(process.env.LOGIN_WINDOW_MS || 15 * 60 * 1000)
const LOCK_MS = Number(process.env.LOGIN_LOCK_MS || 15 * 60 * 1000)

function keyFor(username: string, ip: string | undefined): Key {
  const u = (username || '').toLowerCase().trim()
  return `${u}|${ip || ''}`
}

export function isLocked(username: string, ip?: string): { locked: boolean, msRemaining: number } {
  const key = keyFor(username, ip)
  const now = Date.now()
  const state = attempts.get(key)
  if (!state) return { locked: false, msRemaining: 0 }

  // Reset window if expired
  if (now - state.firstAt > WINDOW_MS) {
    attempts.delete(key)
    return { locked: false, msRemaining: 0 }
  }

  if (state.lockUntil && now < state.lockUntil) {
    return { locked: true, msRemaining: state.lockUntil - now }
  }
  return { locked: false, msRemaining: 0 }
}

export function registerFailure(username: string, ip?: string): { locked: boolean, msRemaining: number } {
  const key = keyFor(username, ip)
  const now = Date.now()
  let state = attempts.get(key)
  if (!state) {
    state = { count: 1, firstAt: now }
    attempts.set(key, state)
  } else {
    // Reset window if expired
    if (now - state.firstAt > WINDOW_MS) {
      state.count = 1
      state.firstAt = now
      state.lockUntil = undefined
    } else {
      state.count += 1
    }
  }
  if (state.count >= MAX_ATTEMPTS) {
    state.lockUntil = now + LOCK_MS
    return { locked: true, msRemaining: LOCK_MS }
  }
  return { locked: false, msRemaining: 0 }
}

export function clearFailures(username: string, ip?: string): void {
  const key = keyFor(username, ip)
  attempts.delete(key)
}


