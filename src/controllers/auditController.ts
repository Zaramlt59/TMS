import { Request, Response } from 'express'
import { AuditService } from '../services/auditService'
import { AuditCleanupService } from '../services/auditCleanupService'
import * as fs from 'fs'
import * as path from 'path'

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

  /**
   * Manually export audit logs to CSV for a specific date range
   */
  static async exportAuditLogsManual(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.body

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        })
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        })
      }

      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'Start date must be before end date'
        })
      }

      const result = await AuditCleanupService.exportLogsToCSVManual(start, end)

      res.json({
        success: true,
        message: 'Audit logs exported successfully',
        data: {
          exportPath: result.exportPath,
          recordCount: result.recordCount,
          filename: path.basename(result.exportPath)
        }
      })
    } catch (error) {
      console.error('Failed to manually export audit logs:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to export audit logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Get list of exported CSV files
   */
  static async getExportedFiles(req: Request, res: Response) {
    try {
      const files = AuditCleanupService.getExportedFiles()
      
      const fileInfo = files.map(filePath => {
        const stats = fs.statSync(filePath)
        return {
          filename: path.basename(filePath),
          filePath: filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        }
      })

      res.json({
        success: true,
        data: fileInfo
      })
    } catch (error) {
      console.error('Failed to get exported files:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get exported files',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Download exported CSV file
   */
  static async downloadExportedFile(req: Request, res: Response) {
    try {
      const { filename } = req.params
      
      if (!filename || !filename.endsWith('.csv')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid filename'
        })
      }

      const filePath = path.join(process.cwd(), 'exports', 'audit-logs', filename)
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        })
      }

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      res.sendFile(filePath)
    } catch (error) {
      console.error('Failed to download exported file:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to download file',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Delete exported CSV file
   */
  static async deleteExportedFile(req: Request, res: Response) {
    try {
      const { filename } = req.params
      
      if (!filename || !filename.endsWith('.csv')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid filename'
        })
      }

      const filePath = path.join(process.cwd(), 'exports', 'audit-logs', filename)
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        })
      }

      fs.unlinkSync(filePath)

      res.json({
        success: true,
        message: 'File deleted successfully'
      })
    } catch (error) {
      console.error('Failed to delete exported file:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
