import express from 'express'
import { AuditController } from '../controllers/auditController'
import { authenticateToken } from '../middleware/auth'
import { requireAdmin } from '../middleware/auth'

const router = express.Router()

// All audit routes require authentication and admin privileges
router.use(authenticateToken)
router.use(requireAdmin)

// Get audit logs with filtering and pagination
router.get('/logs', AuditController.getAuditLogs)

// Get security alerts
router.get('/security-alerts', AuditController.getSecurityAlerts)

// Get audit statistics
router.get('/stats', AuditController.getAuditStats)

// Get audit log details by ID
router.get('/logs/:id', AuditController.getAuditLogById)

// Export audit logs to CSV
router.get('/export', AuditController.exportAuditLogs)

// Manual export audit logs to CSV for specific date range
router.post('/export/manual', AuditController.exportAuditLogsManual)

// Get list of exported CSV files
router.get('/export/files', AuditController.getExportedFiles)

// Download exported CSV file
router.get('/export/files/:filename', AuditController.downloadExportedFile)

// Delete exported CSV file
router.delete('/export/files/:filename', AuditController.deleteExportedFile)

export default router
