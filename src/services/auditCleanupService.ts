import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

export class AuditCleanupService {
  /**
   * Clean up old audit logs based on retention policy
   */
  static async cleanupOldLogs(retentionDays: number = 90): Promise<{
    deletedCount: number
    archivedCount: number
    exportedCount: number
    exportPath?: string
  }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    try {
      // First, get all logs that will be deleted for CSV export
      const logsToDelete = await prisma.audit_logs.findMany({
        where: {
          created_at: { lt: cutoffDate }
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      })

      // Export logs to CSV before deletion
      let exportPath: string | undefined
      let exportedCount = 0
      if (logsToDelete.length > 0) {
        exportPath = await this.exportLogsToCSV(logsToDelete, cutoffDate)
        exportedCount = logsToDelete.length
        console.log(`Exported ${exportedCount} audit logs to CSV: ${exportPath}`)
      }

      // Archive important logs (security events, failed actions)
      const importantLogs = logsToDelete.filter(log => 
        !log.success || 
        ['unauthorized_access', 'permission_denied', 'suspicious_activity', 'login_failed'].includes(log.action)
      )

      // Archive important logs to a separate table
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
        archivedCount: importantLogs.length,
        exportedCount,
        exportPath
      }
    } catch (error) {
      console.error('Failed to cleanup audit logs:', error)
      throw error
    }
  }

  /**
   * Export audit logs to CSV file before deletion
   */
  private static async exportLogsToCSV(logs: any[], cutoffDate: Date): Promise<string> {
    try {
      // Create exports directory if it doesn't exist
      const exportsDir = path.join(process.cwd(), 'exports', 'audit-logs')
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true })
      }

      // Generate filename with date range
      const startDate = new Date(cutoffDate)
      const endDate = new Date()
      const filename = `audit-logs-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv`
      const filePath = path.join(exportsDir, filename)

      // CSV headers
      const headers = [
        'ID',
        'User ID',
        'Username',
        'Email',
        'Role',
        'Action',
        'Resource Type',
        'Resource ID',
        'IP Address',
        'Success',
        'Error Message',
        'Created At',
        'Details'
      ]

      // Convert logs to CSV format
      const csvRows = [headers.join(',')]
      
      for (const log of logs) {
        const row = [
          log.id,
          log.user_id || '',
          log.users?.username || '',
          log.users?.email || '',
          log.users?.role || '',
          log.action,
          log.resource_type || '',
          log.resource_id || '',
          log.ip_address || '',
          log.success ? 'Yes' : 'No',
          log.error_message ? `"${log.error_message.replace(/"/g, '""')}"` : '',
          log.created_at.toISOString(),
          log.details ? `"${log.details.replace(/"/g, '""')}"` : ''
        ]
        csvRows.push(row.join(','))
      }

      // Write CSV file
      fs.writeFileSync(filePath, csvRows.join('\n'), 'utf8')

      // Log export completion
      console.log(`Audit logs exported to: ${filePath}`)
      console.log(`Total records exported: ${logs.length}`)

      return filePath
    } catch (error) {
      console.error('Failed to export audit logs to CSV:', error)
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
   * Manually export audit logs to CSV for a specific date range
   */
  static async exportLogsToCSVManual(startDate: Date, endDate: Date): Promise<{
    exportPath: string
    recordCount: number
  }> {
    try {
      const logs = await prisma.audit_logs.findMany({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      })

      if (logs.length === 0) {
        throw new Error('No audit logs found for the specified date range')
      }

      const exportPath = await this.exportLogsToCSV(logs, startDate)
      
      return {
        exportPath,
        recordCount: logs.length
      }
    } catch (error) {
      console.error('Failed to manually export audit logs:', error)
      throw error
    }
  }

  /**
   * Get list of exported CSV files
   */
  static getExportedFiles(): string[] {
    try {
      const exportsDir = path.join(process.cwd(), 'exports', 'audit-logs')
      if (!fs.existsSync(exportsDir)) {
        return []
      }

      return fs.readdirSync(exportsDir)
        .filter(file => file.endsWith('.csv'))
        .map(file => path.join(exportsDir, file))
        .sort((a, b) => {
          const statA = fs.statSync(a)
          const statB = fs.statSync(b)
          return statB.mtime.getTime() - statA.mtime.getTime() // Sort by newest first
        })
    } catch (error) {
      console.error('Failed to get exported files:', error)
      return []
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
