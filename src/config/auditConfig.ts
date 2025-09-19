export interface AuditConfig {
  // Retention settings
  retentionDays: number
  archiveImportantLogs: boolean
  
  // Queue settings
  maxQueueSize: number
  batchSize: number
  processingInterval: number
  maxRetries: number
  
  // Logging settings
  enableAsyncLogging: boolean
  skipLowPriorityLogs: boolean
  maxDetailsSize: number
  
  // Performance settings
  enableCompression: boolean
  enableIndexing: boolean
  
  // Security settings
  alwaysLogSecurityEvents: boolean
  alwaysLogFailedActions: boolean
}

export const defaultAuditConfig: AuditConfig = {
  // Retention settings
  retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '90'),
  archiveImportantLogs: process.env.AUDIT_ARCHIVE_IMPORTANT === 'true',
  
  // Queue settings
  maxQueueSize: parseInt(process.env.AUDIT_MAX_QUEUE_SIZE || '1000'),
  batchSize: parseInt(process.env.AUDIT_BATCH_SIZE || '50'),
  processingInterval: parseInt(process.env.AUDIT_PROCESSING_INTERVAL || '5000'),
  maxRetries: parseInt(process.env.AUDIT_MAX_RETRIES || '3'),
  
  // Logging settings
  enableAsyncLogging: process.env.AUDIT_ASYNC_LOGGING !== 'false',
  skipLowPriorityLogs: process.env.AUDIT_SKIP_LOW_PRIORITY === 'true',
  maxDetailsSize: parseInt(process.env.AUDIT_MAX_DETAILS_SIZE || '1000'),
  
  // Performance settings
  enableCompression: process.env.AUDIT_ENABLE_COMPRESSION === 'true',
  enableIndexing: process.env.AUDIT_ENABLE_INDEXING !== 'false',
  
  // Security settings
  alwaysLogSecurityEvents: process.env.AUDIT_ALWAYS_LOG_SECURITY !== 'false',
  alwaysLogFailedActions: process.env.AUDIT_ALWAYS_LOG_FAILURES !== 'false'
}

export class AuditConfigManager {
  private static config: AuditConfig = defaultAuditConfig

  /**
   * Get current configuration
   */
  static getConfig(): AuditConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  static updateConfig(updates: Partial<AuditConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  /**
   * Reset to default configuration
   */
  static resetToDefault(): void {
    this.config = { ...defaultAuditConfig }
  }

  /**
   * Get configuration for specific environment
   */
  static getEnvironmentConfig(): AuditConfig {
    const env = process.env.NODE_ENV || 'development'
    
    switch (env) {
      case 'production':
        return {
          ...defaultAuditConfig,
          retentionDays: 30, // Shorter retention in production
          maxQueueSize: 2000, // Larger queue for production
          batchSize: 100, // Larger batches for production
          skipLowPriorityLogs: true, // Skip low priority in production
          enableCompression: true,
          enableIndexing: true
        }
      
      case 'staging':
        return {
          ...defaultAuditConfig,
          retentionDays: 7, // Very short retention for staging
          maxQueueSize: 500,
          batchSize: 25,
          skipLowPriorityLogs: true
        }
      
      case 'development':
        return {
          ...defaultAuditConfig,
          retentionDays: 7, // Short retention for development
          maxQueueSize: 100,
          batchSize: 10,
          skipLowPriorityLogs: false, // Log everything in development
          enableAsyncLogging: false // Synchronous for easier debugging
        }
      
      default:
        return defaultAuditConfig
    }
  }
}
