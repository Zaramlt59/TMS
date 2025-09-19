import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AuditCleanupService {
  /**
   * Clean up old audit logs based on retention policy
   */
  static async cleanupOldLogs(retentionDays: number = 90): Promise<{
    deletedCount: number
    archivedCount: number
  }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    try {
      // First, archive important logs (security events, failed actions)
      const importantLogs = await prisma.audit_logs.findMany({
        where: {
          created_at: { lt: cutoffDate },
          OR: [
            { success: false },
            { action: { in: ['unauthorized_access', 'permission_denied', 'suspicious_activity', 'login_failed'] } }
          ]
        },
        select: {
          id: true,
          user_id: true,
          action: true,
          resource_type: true,
          resource_id: true,
          ip_address: true,
          success: true,
          error_message: true,
          created_at: true
        }
      })

      // Archive important logs to a separate table or file
      if (importantLogs.length > 0) {
        await this.archiveImportantLogs(importantLogs)
      }

      // Delete old logs (both regular and archived)
      const deleteResult = await prisma.audit_logs.deleteMany({
        where: {
          created_at: { lt: cutoffDate }
        }
      })

      return {
        deletedCount: deleteResult.count,
        archivedCount: importantLogs.length
      }
    } catch (error) {
      console.error('Failed to cleanup audit logs:', error)
      throw error
    }
  }

  /**
   * Archive important logs to a separate table
   */
  private static async archiveImportantLogs(logs: any[]): Promise<void> {
    try {
      // Create archived_audit_logs table if it doesn't exist
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS archived_audit_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          original_id INT,
          user_id INT,
          action VARCHAR(50),
          resource_type VARCHAR(50),
          resource_id VARCHAR(50),
          ip_address VARCHAR(45),
          success BOOLEAN,
          error_message VARCHAR(500),
          created_at TIMESTAMP,
          archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_archived_user_id (user_id),
          INDEX idx_archived_action (action),
          INDEX idx_archived_created_at (created_at)
        )
      `

      // Insert archived logs
      for (const log of logs) {
        await prisma.$executeRaw`
          INSERT INTO archived_audit_logs 
          (original_id, user_id, action, resource_type, resource_id, ip_address, success, error_message, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          log.id,
          log.user_id,
          log.action,
          log.resource_type,
          log.resource_id,
          log.ip_address,
          log.success,
          log.error_message,
          log.created_at
        ]
      }
    } catch (error) {
      console.error('Failed to archive important logs:', error)
      throw error
    }
  }

  /**
   * Get audit log statistics for monitoring
   */
  static async getLogStatistics(): Promise<{
    totalLogs: number
    logsLast24h: number
    logsLast7d: number
    logsLast30d: number
    averageLogsPerDay: number
    estimatedStorageMB: number
  }> {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [totalLogs, logsLast24h, logsLast7d, logsLast30d] = await Promise.all([
      prisma.audit_logs.count(),
      prisma.audit_logs.count({ where: { created_at: { gte: last24h } } }),
      prisma.audit_logs.count({ where: { created_at: { gte: last7d } } }),
      prisma.audit_logs.count({ where: { created_at: { gte: last30d } } })
    ])

    const averageLogsPerDay = logsLast30d / 30
    const estimatedStorageMB = Math.round((totalLogs * 0.5) / 1024) // Rough estimate: 0.5KB per log

    return {
      totalLogs,
      logsLast24h,
      logsLast7d,
      logsLast30d,
      averageLogsPerDay,
      estimatedStorageMB
    }
  }

  /**
   * Optimize audit logs table
   */
  static async optimizeTable(): Promise<void> {
    try {
      // Analyze table for optimization
      await prisma.$executeRaw`ANALYZE TABLE audit_logs`
      
      // Optimize table
      await prisma.$executeRaw`OPTIMIZE TABLE audit_logs`
      
      console.log('Audit logs table optimized successfully')
    } catch (error) {
      console.error('Failed to optimize audit logs table:', error)
      throw error
    }
  }
}
