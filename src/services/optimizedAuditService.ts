import { AuditLogData, AuditService } from './auditService'
import { AuditQueueService } from './auditQueueService'

export class OptimizedAuditService {
  /**
   * Log audit event with optimization
   */
  static async log(data: AuditLogData): Promise<void> {
    // Skip audit logging for invalid users
    if (data.userId <= 0) {
      return
    }

    // Skip low-priority logs in high-traffic scenarios
    if (this.shouldSkipLog(data)) {
      return
    }

    // Use queue for asynchronous processing
    AuditQueueService.enqueue(data)
  }

  /**
   * Determine if log should be skipped based on priority and system load
   */
  private static shouldSkipLog(data: AuditLogData): boolean {
    // Always log security events and failures
    if (!data.success || this.isSecurityEvent(data)) {
      return false
    }

    // Skip low-priority view actions during high load
    if (data.action === 'view' && this.isHighLoad()) {
      return true
    }

    // Skip routine actions during maintenance
    if (this.isMaintenanceMode() && this.isRoutineAction(data)) {
      return true
    }

    return false
  }

  /**
   * Check if event is security-related
   */
  private static isSecurityEvent(data: AuditLogData): boolean {
    const securityActions = [
      'unauthorized_access',
      'permission_denied',
      'suspicious_activity',
      'login_failed',
      'password_change',
      'password_reset'
    ]
    
    return securityActions.includes(data.action) || 
           data.resourceType === 'auth' ||
           data.resourceType === 'security'
  }

  /**
   * Check if action is routine (low priority)
   */
  private static isRoutineAction(data: AuditLogData): boolean {
    const routineActions = ['view', 'list', 'search']
    return routineActions.includes(data.action)
  }

  /**
   * Check if system is under high load
   */
  private static isHighLoad(): boolean {
    // This could be enhanced with actual system metrics
    const queueStats = AuditQueueService.getQueueStats()
    return queueStats.queueSize > 500
  }

  /**
   * Check if system is in maintenance mode
   */
  private static isMaintenanceMode(): boolean {
    return process.env.MAINTENANCE_MODE === 'true'
  }

  /**
   * Log authentication events with optimization
   */
  static async logAuth(
    userId: number,
    action: 'login' | 'logout' | 'login_failed' | 'password_change' | 'password_reset',
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    // Always log auth events (high priority)
    const resourceId = action === 'login_failed' && userId <= 0 
      ? 'unknown_user' 
      : `user_${userId}`

    await this.log({
      userId,
      action,
      resourceType: 'auth',
      resourceId,
      ipAddress,
      userAgent,
      success,
      errorMessage
    })
  }

  /**
   * Log data access events with optimization
   */
  static async logDataAccess(
    userId: number,
    action: 'view' | 'create' | 'update' | 'delete' | 'export' | 'import',
    resourceType: string,
    resourceId?: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    // Optimize details object
    const optimizedDetails = this.optimizeDetails(details)

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
    })
  }

  /**
   * Optimize details object to reduce storage
   */
  private static optimizeDetails(details: any): any {
    if (!details) return null

    // Limit details size
    const detailsStr = JSON.stringify(details)
    if (detailsStr.length > 1000) {
      return {
        truncated: true,
        size: detailsStr.length,
        preview: detailsStr.substring(0, 500) + '...'
      }
    }

    return details
  }

  /**
   * Log user management events
   */
  static async logUserManagement(
    userId: number,
    action: 'user_create' | 'user_update' | 'user_delete' | 'user_activate' | 'user_deactivate' | 'role_change',
    targetUserId: number,
    details?: any,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
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
    })
  }

  /**
   * Log security events
   */
  static async logSecurity(
    userId: number,
    action: 'unauthorized_access' | 'permission_denied' | 'suspicious_activity',
    resourceType: string,
    resourceId?: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string,
    errorMessage?: string
  ): Promise<void> {
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
    })
  }

  /**
   * Get audit logs with optimization
   */
  static async getAuditLogs(params: {
    page?: number
    limit?: number
    userId?: number
    action?: string
    resourceType?: string
    success?: boolean
    startDate?: Date
    endDate?: Date
  }): Promise<{
    data: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    // Delegate to original service for now
    return AuditService.getAuditLogs(params)
  }

  /**
   * Get security alerts with optimization
   */
  static async getSecurityAlerts(params: {
    page?: number
    limit?: number
    days?: number
  }): Promise<{
    data: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    // Delegate to original service for now
    return AuditService.getSecurityAlerts(params)
  }

  /**
   * Get audit statistics
   */
  static async getAuditStats(days: number = 30): Promise<{
    totalActions: number
    successfulActions: number
    failedActions: number
    topActions: Array<{ action: string; count: number }>
    topUsers: Array<{ userId: number; username: string; count: number }>
    securityAlerts: number
  }> {
    // Delegate to original service for now
    return AuditService.getAuditStats(days)
  }
}
