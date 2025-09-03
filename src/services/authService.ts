import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export class AuthService {
  async issueRefreshToken(params: {
    userId: number,
    ttlDays: number,
    deviceId?: string,
    ip?: string,
    userAgent?: string,
  }): Promise<{ token: string, expiresAt: Date }> {
    const token = randomUUID()
    const expiresAt = new Date(Date.now() + params.ttlDays * 24 * 60 * 60 * 1000)
    await (prisma as any).refresh_tokens.create({
      data: {
        user_id: params.userId,
        token,
        expires_at: expiresAt,
        device_id: params.deviceId,
        ip_address: params.ip,
        user_agent: params.userAgent,
      }
    })
    return { token, expiresAt }
  }

  async rotateRefreshToken(oldToken: string, params: {
    ttlDays: number,
    deviceId?: string,
    ip?: string,
    userAgent?: string,
  }): Promise<{ token: string, expiresAt: Date, userId: number } | null> {
    const record = await (prisma as any).refresh_tokens.findUnique({ where: { token: oldToken } })
    if (!record || record.revoked_at || record.expires_at < new Date()) return null

    // Create new token
    const { token: newToken, expiresAt } = await this.issueRefreshToken({
      userId: record.user_id,
      ttlDays: params.ttlDays,
      deviceId: params.deviceId,
      ip: params.ip,
      userAgent: params.userAgent,
    })

    // Revoke old token, link to new
    await (prisma as any).refresh_tokens.update({
      where: { token: oldToken },
      data: { revoked_at: new Date(), replaced_by_token: newToken }
    })

    return { token: newToken, expiresAt, userId: record.user_id }
  }

  async revokeToken(token: string): Promise<void> {
    await (prisma as any).refresh_tokens.updateMany({
      where: { token },
      data: { revoked_at: new Date() }
    })
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await (prisma as any).refresh_tokens.updateMany({
      where: { user_id: userId, revoked_at: null },
      data: { revoked_at: new Date() }
    })
  }
}

export const authService = new AuthService()


