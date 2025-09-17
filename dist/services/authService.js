"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
class AuthService {
    async issueRefreshToken(params) {
        const token = (0, crypto_1.randomUUID)();
        const expiresAt = new Date(Date.now() + params.ttlDays * 24 * 60 * 60 * 1000);
        await prisma.refresh_tokens.create({
            data: {
                user_id: params.userId,
                token,
                expires_at: expiresAt,
                device_id: params.deviceId,
                ip_address: params.ip,
                user_agent: params.userAgent,
            }
        });
        return { token, expiresAt };
    }
    async rotateRefreshToken(oldToken, params) {
        const record = await prisma.refresh_tokens.findUnique({ where: { token: oldToken } });
        if (!record || record.revoked_at || record.expires_at < new Date())
            return null;
        // Create new token
        const { token: newToken, expiresAt } = await this.issueRefreshToken({
            userId: record.user_id,
            ttlDays: params.ttlDays,
            deviceId: params.deviceId,
            ip: params.ip,
            userAgent: params.userAgent,
        });
        // Revoke old token, link to new
        await prisma.refresh_tokens.update({
            where: { token: oldToken },
            data: { revoked_at: new Date(), replaced_by_token: newToken }
        });
        return { token: newToken, expiresAt, userId: record.user_id };
    }
    async revokeToken(token) {
        await prisma.refresh_tokens.updateMany({
            where: { token },
            data: { revoked_at: new Date() }
        });
    }
    async revokeAllForUser(userId, excludeToken) {
        const whereClause = {
            user_id: userId,
            revoked_at: null
        };
        if (excludeToken) {
            whereClause.token = { not: excludeToken };
        }
        const result = await prisma.refresh_tokens.updateMany({
            where: whereClause,
            data: { revoked_at: new Date() }
        });
        return result.count;
    }
    async getUserSessions(userId) {
        const sessions = await prisma.refresh_tokens.findMany({
            where: {
                user_id: userId,
                revoked_at: null,
                expires_at: { gt: new Date() }
            },
            select: {
                token: true,
                created_at: true,
                expires_at: true,
                device_id: true,
                ip_address: true,
                user_agent: true
            },
            orderBy: { created_at: 'desc' }
        });
        return sessions.map(session => ({
            id: session.token,
            createdAt: session.created_at,
            expiresAt: session.expires_at,
            deviceId: session.device_id,
            ipAddress: session.ip_address,
            userAgent: session.user_agent,
            isActive: session.expires_at > new Date()
        }));
    }
    async revokeSession(sessionId, userId) {
        const result = await prisma.refresh_tokens.updateMany({
            where: {
                token: sessionId,
                user_id: userId,
                revoked_at: null
            },
            data: { revoked_at: new Date() }
        });
        return result.count > 0;
    }
    async getSessionInfo(sessionId, userId) {
        const session = await prisma.refresh_tokens.findFirst({
            where: {
                token: sessionId,
                user_id: userId
            },
            select: {
                token: true,
                created_at: true,
                expires_at: true,
                revoked_at: true,
                device_id: true,
                ip_address: true,
                user_agent: true
            }
        });
        if (!session)
            return null;
        return {
            id: session.token,
            createdAt: session.created_at,
            expiresAt: session.expires_at,
            revokedAt: session.revoked_at,
            deviceId: session.device_id,
            ipAddress: session.ip_address,
            userAgent: session.user_agent,
            isActive: !session.revoked_at && session.expires_at > new Date()
        };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map