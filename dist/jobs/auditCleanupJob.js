"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditCleanupJob = void 0;
const auditCleanupService_1 = require("../services/auditCleanupService");
const auditQueueService_1 = require("../services/auditQueueService");
class AuditCleanupJob {
    /**
     * Start the audit cleanup job using setInterval (no external dependencies)
     */
    static start() {
        // Run cleanup every 24 hours (86400000 ms)
        const cleanupInterval = setInterval(async () => {
            await this.runCleanup();
        }, 24 * 60 * 60 * 1000);
        // Run optimization every 7 days (604800000 ms)
        const optimizationInterval = setInterval(async () => {
            await this.runOptimization();
        }, 7 * 24 * 60 * 60 * 1000);
        // Monitor queue every 5 minutes (300000 ms)
        const monitorInterval = setInterval(async () => {
            await this.monitorQueue();
        }, 5 * 60 * 1000);
        // Store intervals for cleanup
        this.intervals.push(cleanupInterval, optimizationInterval, monitorInterval);
        console.log('Audit cleanup jobs started (using setInterval)');
    }
    /**
     * Stop all cleanup jobs
     */
    static stop() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        console.log('Audit cleanup jobs stopped');
    }
    /**
     * Run the cleanup process
     */
    static async runCleanup() {
        if (this.isRunning) {
            console.log('Audit cleanup already running, skipping...');
            return;
        }
        this.isRunning = true;
        console.log('Starting audit cleanup job...');
        try {
            // Get retention days from environment (default 90 days)
            const retentionDays = parseInt(process.env.AUDIT_RETENTION_DAYS || '90');
            // Run cleanup
            const result = await auditCleanupService_1.AuditCleanupService.cleanupOldLogs(retentionDays);
            console.log('Audit cleanup completed:', {
                deletedCount: result.deletedCount,
                archivedCount: result.archivedCount,
                exportedCount: result.exportedCount,
                exportPath: result.exportPath,
                retentionDays
            });
            // Get statistics after cleanup
            const stats = await auditCleanupService_1.AuditCleanupService.getLogStatistics();
            console.log('Audit log statistics:', stats);
        }
        catch (error) {
            console.error('Audit cleanup failed:', error);
        }
        finally {
            this.isRunning = false;
        }
    }
    /**
     * Run table optimization
     */
    static async runOptimization() {
        console.log('Starting audit table optimization...');
        try {
            await auditCleanupService_1.AuditCleanupService.optimizeTable();
            console.log('Audit table optimization completed');
        }
        catch (error) {
            console.error('Audit table optimization failed:', error);
        }
    }
    /**
     * Monitor queue health
     */
    static async monitorQueue() {
        try {
            const queueStats = auditQueueService_1.AuditQueueService.getQueueStats();
            // Alert if queue is getting too large
            if (queueStats.queueSize > 1000) {
                console.warn('Audit queue is large:', queueStats);
            }
            // Alert if logs are getting too old
            if (queueStats.oldestLogAge > 300000) { // 5 minutes
                console.warn('Old audit logs in queue:', queueStats);
            }
        }
        catch (error) {
            console.error('Queue monitoring failed:', error);
        }
    }
    /**
     * Manual cleanup trigger
     */
    static async manualCleanup(retentionDays) {
        console.log('Manual audit cleanup triggered');
        await this.runCleanup();
    }
    /**
     * Get job status
     */
    static getStatus() {
        return {
            isRunning: this.isRunning,
            queueStats: auditQueueService_1.AuditQueueService.getQueueStats(),
            activeJobs: this.intervals.length
        };
    }
    /**
     * Graceful shutdown - flush queue and stop jobs
     */
    static async shutdown() {
        console.log('Shutting down audit cleanup jobs...');
        // Stop all intervals
        this.stop();
        // Flush any remaining audit logs
        try {
            await auditQueueService_1.AuditQueueService.flushQueue();
            console.log('Audit queue flushed successfully');
        }
        catch (error) {
            console.error('Failed to flush audit queue during shutdown:', error);
        }
        console.log('Audit cleanup jobs shutdown complete');
    }
}
exports.AuditCleanupJob = AuditCleanupJob;
AuditCleanupJob.isRunning = false;
AuditCleanupJob.intervals = [];
//# sourceMappingURL=auditCleanupJob.js.map