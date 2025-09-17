"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFailedAuth = exports.logSecurityEvent = exports.logUserManagement = exports.logAuthEvent = exports.logApiRequest = exports.extractClientInfo = void 0;
const auditService_1 = require("../services/auditService");
/**
 * Middleware to extract client information for audit logging
 */
const extractClientInfo = (req, res, next) => {
    // Extract IP address
    const ipAddress = req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection?.socket?.remoteAddress ||
        req.headers['x-forwarded-for']?.toString().split(',')[0] ||
        'unknown';
    // Extract User Agent
    const userAgent = req.headers['user-agent'] || 'unknown';
    // Attach to request for use in audit logging
    req.auditData = {
        action: '',
        resourceType: '',
        resourceId: '',
        details: {
            ipAddress,
            userAgent,
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date().toISOString()
        }
    };
    next();
};
exports.extractClientInfo = extractClientInfo;
/**
 * Middleware to log API requests
 */
const logApiRequest = (action, resourceType) => {
    return (req, res, next) => {
        // Set audit data
        if (req.auditData) {
            req.auditData.action = action;
            req.auditData.resourceType = resourceType;
            req.auditData.resourceId = req.params.id || req.body?.id?.toString();
        }
        // Log successful requests
        const originalSend = res.send;
        res.send = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user?.id) {
                // Log successful action
                auditService_1.AuditService.logDataAccess(req.user.id, action, resourceType, req.auditData?.resourceId, req.auditData?.details, req.auditData?.details?.ipAddress, req.auditData?.details?.userAgent, true).catch(console.error);
            }
            return originalSend.call(this, data);
        };
        // Log failed requests
        const originalJson = res.json;
        res.json = function (data) {
            if (res.statusCode >= 400 && req.user?.id) {
                // Log failed action
                auditService_1.AuditService.logDataAccess(req.user.id, action, resourceType, req.auditData?.resourceId, {
                    ...req.auditData?.details,
                    error: data.message || 'Unknown error',
                    statusCode: res.statusCode
                }, req.auditData?.details?.ipAddress, req.auditData?.details?.userAgent, false, data.message || 'Unknown error').catch(console.error);
            }
            return originalJson.call(this, data);
        };
        next();
    };
};
exports.logApiRequest = logApiRequest;
/**
 * Middleware to log authentication events
 */
const logAuthEvent = (action) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            if (req.user?.id) {
                const success = res.statusCode >= 200 && res.statusCode < 300;
                auditService_1.AuditService.logAuth(req.user.id, action, req.auditData?.details?.ipAddress, req.auditData?.details?.userAgent, success, success ? undefined : data.message).catch(console.error);
            }
            return originalSend.call(this, data);
        };
        next();
    };
};
exports.logAuthEvent = logAuthEvent;
/**
 * Middleware to log user management events
 */
const logUserManagement = (action) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            if (req.user?.id) {
                const success = res.statusCode >= 200 && res.statusCode < 300;
                const targetUserId = req.params.id || req.body?.id || req.body?.userId;
                auditService_1.AuditService.logUserManagement(req.user.id, action, parseInt(targetUserId) || 0, {
                    ...req.auditData?.details,
                    requestBody: req.body,
                    responseData: success ? data : undefined
                }, req.auditData?.details?.ipAddress, req.auditData?.details?.userAgent, success, success ? undefined : data.message).catch(console.error);
            }
            return originalSend.call(this, data);
        };
        next();
    };
};
exports.logUserManagement = logUserManagement;
/**
 * Middleware to log security events
 */
const logSecurityEvent = (action) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            if (req.user?.id) {
                auditService_1.AuditService.logSecurity(req.user.id, action, req.auditData?.resourceType || 'unknown', req.auditData?.resourceId, {
                    ...req.auditData?.details,
                    error: data.message || 'Security event',
                    statusCode: res.statusCode
                }, req.auditData?.details?.ipAddress, req.auditData?.details?.userAgent, data.message).catch(console.error);
            }
            return originalSend.call(this, data);
        };
        next();
    };
};
exports.logSecurityEvent = logSecurityEvent;
/**
 * Middleware to log failed authentication attempts
 */
const logFailedAuth = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
        if (res.statusCode >= 400) {
            // Try to extract user info from request body
            const username = req.body?.username || req.body?.email || 'unknown';
            // Create a temporary user ID for failed auth attempts
            const tempUserId = 0; // Use 0 for failed auth attempts
            auditService_1.AuditService.logAuth(tempUserId, 'login_failed', req.auditData?.details?.ipAddress, req.auditData?.details?.userAgent, false, data.message || 'Authentication failed').catch(console.error);
        }
        return originalSend.call(this, data);
    };
    next();
};
exports.logFailedAuth = logFailedAuth;
//# sourceMappingURL=auditMiddleware.js.map