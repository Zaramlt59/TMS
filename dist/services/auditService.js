"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuditService {
    /**
     * Log an audit event
     */
    static async log(data) {
        try {
            // Skip audit logging if userId is 0 or invalid (for failed auth attempts)
            if (data.userId <= 0) {
                console.log('Skipping audit log for invalid user ID:', data.userId);
                return;
            }
            await prisma.audit_logs.create({
                data: {
                    user_id: data.userId,
                    action: data.action, // Cast to enum type
                    resource_type: data.resourceType,
                    resource_id: data.resourceId,
                    details: data.details ? JSON.stringify(data.details) : null,
                    ip_address: data.ipAddress,
                    user_agent: data.userAgent,
                    success: data.success ?? true,
                    error_message: data.errorMessage
                }
            });
        }
        catch (error) {
            // Don't throw errors from audit logging to avoid breaking the main flow
            console.error('Failed to log audit event:', error);
        }
    }
    /**
     * Log authentication events
     */
    static async logAuth(userId, action, ipAddress, userAgent, success = true, errorMessage) {
        // Set appropriate resource ID based on action
        let resourceId;
        if (action === 'login_failed') {
            // For failed logins, we might not have a valid user ID
            resourceId = userId > 0 ? `user_${userId}` : 'unknown_user';
        }
        else {
            // For successful auth events, use the user ID as resource ID
            resourceId = `user_${userId}`;
        }
        await this.log({
            userId,
            action,
            resourceType: 'auth',
            resourceId,
            ipAddress,
            userAgent,
            success,
            errorMessage
        });
    }
    /**
     * Log user management events
     */
    static async logUserManagement(userId, action, targetUserId, details, ipAddress, userAgent, success = true, errorMessage) {
        await this.log({
            userId,
            action,
            resourceType: 'user',
            resourceId: targetUserId.toString(),
            details,
            ipAddress,
            userAgent,
            success,
            errorMessage
        });
    }
    /**
     * Log data access events
     */
    static async logDataAccess(userId, action, resourceType, resourceId, details, ipAddress, userAgent, success = true, errorMessage) {
        await this.log({
            userId,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress,
            userAgent,
            success,
            errorMessage
        });
    }
    /**
     * Log security events
     */
    static async logSecurity(userId, action, resourceType, resourceId, details, ipAddress, userAgent, errorMessage) {
        await this.log({
            userId,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress,
            userAgent,
            success: false, // Security events are typically failures
            errorMessage
        });
    }
    /**
     * Get audit logs with filtering and pagination
     */
    static async getAuditLogs(params) {
        const { page = 1, limit = 20, userId, action, resourceType, success, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {};
        if (userId)
            where.user_id = userId;
        if (action)
            where.action = action;
        if (resourceType)
            where.resource_type = resourceType;
        if (success !== undefined)
            where.success = success;
        if (startDate || endDate) {
            where.created_at = {};
            if (startDate)
                where.created_at.gte = startDate;
            if (endDate)
                where.created_at.lte = endDate;
        }
        const [data, total] = await Promise.all([
            prisma.audit_logs.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true
                        }
                    }
                }
            }),
            prisma.audit_logs.count({ where })
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    /**
     * Get security alerts (failed actions, unauthorized access, etc.)
     */
    static async getSecurityAlerts(params) {
        const { page = 1, limit = 20, days = 7 } = params;
        const skip = (page - 1) * limit;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const where = {
            OR: [
                { success: false },
                { action: { in: ['unauthorized_access', 'permission_denied', 'suspicious_activity', 'login_failed'] } }
            ],
            created_at: { gte: startDate }
        };
        const [data, total] = await Promise.all([
            prisma.audit_logs.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true
                        }
                    }
                }
            }),
            prisma.audit_logs.count({ where })
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    /**
     * Get audit statistics
     */
    static async getAuditStats(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const where = { created_at: { gte: startDate } };
        const [totalActions, successfulActions, failedActions, topActions, topUsers, securityAlerts] = await Promise.all([
            prisma.audit_logs.count({ where }),
            prisma.audit_logs.count({ where: { ...where, success: true } }),
            prisma.audit_logs.count({ where: { ...where, success: false } }),
            prisma.audit_logs.groupBy({
                by: ['action'],
                where,
                _count: { action: true },
                orderBy: { _count: { action: 'desc' } },
                take: 10
            }),
            prisma.audit_logs.groupBy({
                by: ['user_id'],
                where,
                _count: { user_id: true },
                orderBy: { _count: { user_id: 'desc' } },
                take: 10
            }),
            prisma.audit_logs.count({
                where: {
                    ...where,
                    OR: [
                        { success: false },
                        { action: { in: ['unauthorized_access', 'permission_denied', 'suspicious_activity', 'login_failed'] } }
                    ]
                }
            })
        ]);
        // Get usernames for top users
        const userIds = topUsers.map(u => u.user_id);
        const users = await prisma.users.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true }
        });
        const userMap = new Map(users.map(u => [u.id, u.username]));
        return {
            totalActions,
            successfulActions,
            failedActions,
            topActions: topActions.map(a => ({ action: a.action, count: a._count.action })),
            topUsers: topUsers.map(u => ({
                userId: u.user_id,
                username: userMap.get(u.user_id) || 'Unknown',
                count: u._count.user_id
            })),
            securityAlerts
        };
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=auditService.js.map