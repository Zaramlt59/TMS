"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const auditService_1 = require("../services/auditService");
const auditCleanupService_1 = require("../services/auditCleanupService");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
    /**
     * Manually export audit logs to CSV for a specific date range
     */
    static async exportAuditLogsManual(req, res) {
        try {
            const { startDate, endDate } = req.body;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
            }
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
            }
            if (start >= end) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date must be before end date'
                });
            }
            const result = await auditCleanupService_1.AuditCleanupService.exportLogsToCSVManual(start, end);
            res.json({
                success: true,
                message: 'Audit logs exported successfully',
                data: {
                    exportPath: result.exportPath,
                    recordCount: result.recordCount,
                    filename: path.basename(result.exportPath)
                }
            });
        }
        catch (error) {
            console.error('Failed to manually export audit logs:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to export audit logs',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get list of exported CSV files
     */
    static async getExportedFiles(req, res) {
        try {
            const files = auditCleanupService_1.AuditCleanupService.getExportedFiles();
            const fileInfo = files.map(filePath => {
                const stats = fs.statSync(filePath);
                return {
                    filename: path.basename(filePath),
                    filePath: filePath,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            });
            res.json({
                success: true,
                data: fileInfo
            });
        }
        catch (error) {
            console.error('Failed to get exported files:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get exported files',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Download exported CSV file
     */
    static async downloadExportedFile(req, res) {
        try {
            const { filename } = req.params;
            if (!filename || !filename.endsWith('.csv')) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid filename'
                });
            }
            const filePath = path.join(process.cwd(), 'exports', 'audit-logs', filename);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.sendFile(filePath);
        }
        catch (error) {
            console.error('Failed to download exported file:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to download file',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Delete exported CSV file
     */
    static async deleteExportedFile(req, res) {
        try {
            const { filename } = req.params;
            if (!filename || !filename.endsWith('.csv')) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid filename'
                });
            }
            const filePath = path.join(process.cwd(), 'exports', 'audit-logs', filename);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        }
        catch (error) {
            console.error('Failed to delete exported file:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete file',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.AuditController = AuditController;
//# sourceMappingURL=auditController.js.map