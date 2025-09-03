type Env = {
  PORT: number
  DB_HOST: string
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
  DB_PORT: number
  JWT_SECRET: string
  CORS_ORIGIN?: string
  SENTRY_DSN?: string
}

function requireString(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

function requireNumber(name: string, fallback?: number): number {
  const raw = process.env[name]
  const v = raw ? Number(raw) : fallback
  if (v === undefined || Number.isNaN(v)) throw new Error(`Invalid numeric env: ${name}`)
  return v
}

export function loadEnv(): Env {
  return {
    PORT: requireNumber('PORT', 5004),
    DB_HOST: requireString('DB_HOST', 'localhost'),
    DB_USER: requireString('DB_USER', 'root'),
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_NAME: requireString('DB_NAME', 'ttms_db'),
    DB_PORT: requireNumber('DB_PORT', 3306),
    JWT_SECRET: requireString('JWT_SECRET', 'change-me'),
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    SENTRY_DSN: process.env.SENTRY_DSN,
  }
}


