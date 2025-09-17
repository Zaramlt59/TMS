import { Request, Response } from 'express'
import { AuditService } from '../services/auditService'

export class AuditController {
  /**
   * Get audit logs with filtering and pagination
   */
  static async getAuditLogs(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        userId,
        action,
        resourceType,
        success,
        startDate,
        endDate
      } = req.query

      const result = await AuditService.getAuditLogs({
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        userId: userId ? parseInt(userId as string) : undefined,
        action: action as string,
        resourceType: resourceType as string,
        success: success !== undefined ? success === 'true' : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      })

      res.json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      })
    } catch (error) {
      console.error('Failed to get audit logs:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get audit logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Get security alerts
   */
  static async getSecurityAlerts(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        days = 7
      } = req.query

      const result = await AuditService.getSecurityAlerts({
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        days: parseInt(days as string) || 7
      })

      res.json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      })
    } catch (error) {
      console.error('Failed to get security alerts:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get security alerts',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Get audit statistics
   */
  static async getAuditStats(req: Request, res: Response) {
    try {
      const { days = 30 } = req.query
      const stats = await AuditService.getAuditStats(parseInt(days as string) || 30)

      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      console.error('Failed to get audit stats:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get audit statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Get audit log details by ID
   */
  static async getAuditLogById(req: Request, res: Response) {
    try {
      const { id } = req.params

      // This would require adding a getById method to AuditService
      // For now, we'll return a placeholder
      res.json({
        success: true,
        message: 'Audit log details endpoint - to be implemented'
      })
    } catch (error) {
      console.error('Failed to get audit log details:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get audit log details',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Export audit logs to CSV
   */
  static async exportAuditLogs(req: Request, res: Response) {
    try {
      const {
        userId,
        action,
        resourceType,
        success,
        startDate,
        endDate
      } = req.query

      // Get all matching records (no pagination for export)
      const result = await AuditService.getAuditLogs({
        page: 1,
        limit: 10000, // Large limit for export
        userId: userId ? parseInt(userId as string) : undefined,
        action: action as string,
        resourceType: resourceType as string,
        success: success !== undefined ? success === 'true' : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      })

      // Convert to CSV format
      const csvHeader = 'ID,User,Action,Resource Type,Resource ID,Success,IP Address,User Agent,Timestamp,Details\n'
      const csvRows = result.data.map(log => {
        const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : ''
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
        ].join(',')
      }).join('\n')

      const csv = csvHeader + csvRows

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.csv"')
      res.send(csv)
    } catch (error) {
      console.error('Failed to export audit logs:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to export audit logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
