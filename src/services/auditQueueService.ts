import { AuditLogData } from './auditService'

interface QueuedAuditLog extends AuditLogData {
  timestamp: number
  retryCount: number
}

export class AuditQueueService {
  private static queue: QueuedAuditLog[] = []
  private static isProcessing = false
  private static maxQueueSize = 1000
  private static maxRetries = 3
  private static batchSize = 50
  private static processingInterval = 5000 // 5 seconds

  /**
   * Add audit log to queue for asynchronous processing
   */
  static enqueue(auditData: AuditLogData): void {
    // Skip if queue is full
    if (this.queue.length >= this.maxQueueSize) {
      console.warn('Audit queue is full, dropping log entry')
      return
    }

    const queuedLog: QueuedAuditLog = {
      ...auditData,
      timestamp: Date.now(),
      retryCount: 0
    }

    this.queue.push(queuedLog)

    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing()
    }
  }

  /**
   * Start processing the audit queue
   */
  private static startProcessing(): void {
    if (this.isProcessing) return

    this.isProcessing = true
    this.processQueue()
  }

  /**
   * Process the audit queue in batches
   */
  private static async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize)
      
      try {
        await this.processBatch(batch)
      } catch (error) {
        console.error('Failed to process audit batch:', error)
        // Re-queue failed logs with retry count
        this.requeueFailedLogs(batch)
      }

      // Small delay between batches to prevent overwhelming the database
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    this.isProcessing = false

    // Schedule next processing cycle
    if (this.queue.length > 0) {
      setTimeout(() => this.startProcessing(), this.processingInterval)
    }
  }

  /**
   * Process a batch of audit logs
   */
  private static async processBatch(batch: QueuedAuditLog[]): Promise<void> {
    const { AuditService } = await import('./auditService')
    
    const promises = batch.map(log => 
      AuditService.log(log).catch(error => {
        console.error('Failed to log audit entry:', error)
        throw error
      })
    )

    await Promise.allSettled(promises)
  }

  /**
   * Re-queue failed logs with retry count
   */
  private static requeueFailedLogs(failedLogs: QueuedAuditLog[]): void {
    for (const log of failedLogs) {
      if (log.retryCount < this.maxRetries) {
        log.retryCount++
        this.queue.unshift(log) // Add to front of queue for retry
      } else {
        console.error('Max retries exceeded for audit log:', log)
      }
    }
  }

  /**
   * Get queue statistics
   */
  static getQueueStats(): {
    queueSize: number
    isProcessing: boolean
    oldestLogAge: number
  } {
    const oldestLog = this.queue[0]
    const oldestLogAge = oldestLog ? Date.now() - oldestLog.timestamp : 0

    return {
      queueSize: this.queue.length,
      isProcessing: this.isProcessing,
      oldestLogAge
    }
  }

  /**
   * Force process all queued logs (for shutdown)
   */
  static async flushQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize)
      try {
        await this.processBatch(batch)
      } catch (error) {
        console.error('Failed to flush audit queue:', error)
        break
      }
    }
  }
}
