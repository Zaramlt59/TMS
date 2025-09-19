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
exports.AuditQueueService = void 0;
class AuditQueueService {
    /**
     * Add audit log to queue for asynchronous processing
     */
    static enqueue(auditData) {
        // Skip if queue is full
        if (this.queue.length >= this.maxQueueSize) {
            console.warn('Audit queue is full, dropping log entry');
            return;
        }
        const queuedLog = {
            ...auditData,
            timestamp: Date.now(),
            retryCount: 0
        };
        this.queue.push(queuedLog);
        // Start processing if not already running
        if (!this.isProcessing) {
            this.startProcessing();
        }
    }
    /**
     * Start processing the audit queue
     */
    static startProcessing() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        this.processQueue();
    }
    /**
     * Process the audit queue in batches
     */
    static async processQueue() {
        while (this.queue.length > 0) {
            const batch = this.queue.splice(0, this.batchSize);
            try {
                await this.processBatch(batch);
            }
            catch (error) {
                console.error('Failed to process audit batch:', error);
                // Re-queue failed logs with retry count
                this.requeueFailedLogs(batch);
            }
            // Small delay between batches to prevent overwhelming the database
            if (this.queue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        this.isProcessing = false;
        // Schedule next processing cycle
        if (this.queue.length > 0) {
            setTimeout(() => this.startProcessing(), this.processingInterval);
        }
    }
    /**
     * Process a batch of audit logs
     */
    static async processBatch(batch) {
        const { AuditService } = await Promise.resolve().then(() => __importStar(require('./auditService')));
        const promises = batch.map(log => AuditService.log(log).catch(error => {
            console.error('Failed to log audit entry:', error);
            throw error;
        }));
        await Promise.allSettled(promises);
    }
    /**
     * Re-queue failed logs with retry count
     */
    static requeueFailedLogs(failedLogs) {
        for (const log of failedLogs) {
            if (log.retryCount < this.maxRetries) {
                log.retryCount++;
                this.queue.unshift(log); // Add to front of queue for retry
            }
            else {
                console.error('Max retries exceeded for audit log:', log);
            }
        }
    }
    /**
     * Get queue statistics
     */
    static getQueueStats() {
        const oldestLog = this.queue[0];
        const oldestLogAge = oldestLog ? Date.now() - oldestLog.timestamp : 0;
        return {
            queueSize: this.queue.length,
            isProcessing: this.isProcessing,
            oldestLogAge
        };
    }
    /**
     * Force process all queued logs (for shutdown)
     */
    static async flushQueue() {
        while (this.queue.length > 0) {
            const batch = this.queue.splice(0, this.batchSize);
            try {
                await this.processBatch(batch);
            }
            catch (error) {
                console.error('Failed to flush audit queue:', error);
                break;
            }
        }
    }
}
exports.AuditQueueService = AuditQueueService;
AuditQueueService.queue = [];
AuditQueueService.isProcessing = false;
AuditQueueService.maxQueueSize = 1000;
AuditQueueService.maxRetries = 3;
AuditQueueService.batchSize = 50;
AuditQueueService.processingInterval = 5000; // 5 seconds
//# sourceMappingURL=auditQueueService.js.map