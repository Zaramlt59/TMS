"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const auditService_1 = require("../services/auditService");
class AuditController {
    /**
     * Get audit logs with filtering and pagination
     */
    static async getAuditLogs(req, res) {
        try {
            const { page = 1, limit = 20, userId, action, resourceType, success, startDate, endDate } = req.query;
            const result = await auditService_1.AuditService.getAuditLogs({
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                userId: userId ? parseInt(userId) : undefined,
                action: action,
                resourceType: resourceType,
                success: success !== undefined ? success === 'true' : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            });
            res.json({
                success: true,
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            console.error('Failed to get audit logs:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get audit logs',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get security alerts
     */
    static async getSecurityAlerts(req, res) {
        try {
            const { page = 1, limit = 20, days = 7 } = req.query;
            const result = await auditService_1.AuditService.getSecurityAlerts({
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                days: parseInt(days) || 7
            });
            res.json({
                success: true,
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            console.error('Failed to get security alerts:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get security alerts',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get audit statistics
     */
    static async getAuditStats(req, res) {
        try {
            const { days = 30 } = req.query;
            const stats = await auditService_1.AuditService.getAuditStats(parseInt(days) || 30);
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('Failed to get audit stats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get audit statistics',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get audit log details by ID
     */
    static async getAuditLogById(req, res) {
        try {
            const { id } = req.params;
            // This would require adding a getById method to AuditService
            // For now, we'll return a placeholder
            res.json({
                success: true,
                message: 'Audit log details endpoint - to be implemented'
            });
        }
        catch (error) {
            console.error('Failed to get audit log details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get audit log details',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Export audit logs to CSV
     */
    static async exportAuditLogs(req, res) {
        try {
            const { userId, action, resourceType, success, startDate, endDate } = req.query;
            // Get all matching records (no pagination for export)
            const result = await auditService_1.AuditService.getAuditLogs({
                page: 1,
                limit: 10000, // Large limit for export
                userId: userId ? parseInt(userId) : undefined,
                action: action,
                resourceType: resourceType,
                success: success !== undefined ? success === 'true' : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            });
            // Convert to CSV format
            const csvHeader = 'ID,User,Action,Resource Type,Resource ID,Success,IP Address,User Agent,Timestamp,Details\n';
            const csvRows = result.data.map(log => {
                const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
                return [
                    log.id,
                    `"${log.users.username}"`,
                    log.action,
                    log.resource_type,
                    log.resource_id || '',
                    log.success ? 'Yes' : 'No',
                    log.ip_address || '',
                    `"${log.user_agent || ''}"`,
                    log.created_at.toISOString(),
                    `"${details}"`
                ].join(',');
            }).join('\n');
            const csv = csvHeader + csvRows;
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.csv"');
            res.send(csv);
        }
        catch (error) {
            console.error('Failed to export audit logs:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to export audit logs',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.AuditController = AuditController;
//# sourceMappingURL=auditController.js.map