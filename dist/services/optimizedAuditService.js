"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizedAuditService = void 0;
const auditService_1 = require("./auditService");
const auditQueueService_1 = require("./auditQueueService");
class OptimizedAuditService {
    /**
     * Log audit event with optimization
     */
    static async log(data) {
        // Skip audit logging for invalid users
        if (data.userId <= 0) {
            return;
        }
        // Skip low-priority logs in high-traffic scenarios
        if (this.shouldSkipLog(data)) {
            return;
        }
        // Use queue for asynchronous processing
        auditQueueService_1.AuditQueueService.enqueue(data);
    }
    /**
     * Determine if log should be skipped based on priority and system load
     */
    static shouldSkipLog(data) {
        // Always log security events and failures
        if (!data.success || this.isSecurityEvent(data)) {
            return false;
        }
        // Skip low-priority view actions during high load
        if (data.action === 'view' && this.isHighLoad()) {
            return true;
        }
        // Skip routine actions during maintenance
        if (this.isMaintenanceMode() && this.isRoutineAction(data)) {
            return true;
        }
        return false;
    }
    /**
     * Check if event is security-related
     */
    static isSecurityEvent(data) {
        const securityActions = [
            'unauthorized_access',
            'permission_denied',
            'suspicious_activity',
            'login_failed',
            'password_change',
            'password_reset'
        ];
        return securityActions.includes(data.action) ||
            data.resourceType === 'auth' ||
            data.resourceType === 'security';
    }
    /**
     * Check if action is routine (low priority)
     */
    static isRoutineAction(data) {
        const routineActions = ['view', 'list', 'search'];
        return routineActions.includes(data.action);
    }
    /**
     * Check if system is under high load
     */
    static isHighLoad() {
        // This could be enhanced with actual system metrics
        const queueStats = auditQueueService_1.AuditQueueService.getQueueStats();
        return queueStats.queueSize > 500;
    }
    /**
     * Check if system is in maintenance mode
     */
    static isMaintenanceMode() {
        return process.env.MAINTENANCE_MODE === 'true';
    }
    /**
     * Log authentication events with optimization
     */
    static async logAuth(userId, action, ipAddress, userAgent, success = true, errorMessage) {
        // Always log auth events (high priority)
        const resourceId = action === 'login_failed' && userId <= 0
            ? 'unknown_user'
            : `user_${userId}`;
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
     * Log data access events with optimization
     */
    static async logDataAccess(userId, action, resourceType, resourceId, details, ipAddress, userAgent, success = true, errorMessage) {
        // Optimize details object
        const optimizedDetails = this.optimizeDetails(details);
        await this.log({
            userId,
            action,
            resourceType,
            resourceId,
            details: optimizedDetails,
            ipAddress,
            userAgent,
            success,
            errorMessage
        });
    }
    /**
     * Optimize details object to reduce storage
     */
    static optimizeDetails(details) {
        if (!details)
            return null;
        // Limit details size
        const detailsStr = JSON.stringify(details);
        if (detailsStr.length > 1000) {
            return {
                truncated: true,
                size: detailsStr.length,
                preview: detailsStr.substring(0, 500) + '...'
            };
        }
        return details;
    }
    /**
     * Log user management events
     */
    static async logUserManagement(userId, action, targetUserId, details, ipAddress, userAgent, success = true, errorMessage) {
        // Always log user management events (high priority)
        await this.log({
            userId,
            action,
            resourceType: 'user',
            resourceId: targetUserId.toString(),
            details: this.optimizeDetails(details),
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
        // Always log security events (highest priority)
        await this.log({
            userId,
            action,
            resourceType,
            resourceId,
            details: this.optimizeDetails(details),
            ipAddress,
            userAgent,
            success: false,
            errorMessage
        });
    }
    /**
     * Get audit logs with optimization
     */
    static async getAuditLogs(params) {
        // Delegate to original service for now
        return auditService_1.AuditService.getAuditLogs(params);
    }
    /**
     * Get security alerts with optimization
     */
    static async getSecurityAlerts(params) {
        // Delegate to original service for now
        return auditService_1.AuditService.getSecurityAlerts(params);
    }
    /**
     * Get audit statistics
     */
    static async getAuditStats(days = 30) {
        // Delegate to original service for now
        return auditService_1.AuditService.getAuditStats(days);
    }
}
exports.OptimizedAuditService = OptimizedAuditService;
//# sourceMappingURL=optimizedAuditService.js.map