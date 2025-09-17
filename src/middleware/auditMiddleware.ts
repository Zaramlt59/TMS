import { Request, Response, NextFunction } from 'express'
import { AuditService } from '../services/auditService'

// Extend Request interface to include audit data
declare global {
  namespace Express {
    interface Request {
      auditData?: {
        action: string
        resourceType: string
        resourceId?: string
        details?: any
      }
    }
  }
}

/**
 * Middleware to extract client information for audit logging
 */
export const extractClientInfo = (req: Request, res: Response, next: NextFunction) => {
  // Extract IP address
  const ipAddress = req.ip || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    (req.connection as any)?.socket?.remoteAddress ||
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    'unknown'

  // Extract User Agent
  const userAgent = req.headers['user-agent'] || 'unknown'

  // Attach to request for use in audit logging
  req.auditData = {
    action: '',
    resourceType: '',
    resourceId: '',
    details: {
      ipAddress,
      userAgent,
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  }

  next()
}

/**
 * Middleware to log API requests
 */
export const logApiRequest = (action: string, resourceType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set audit data
    if (req.auditData) {
      req.auditData.action = action
      req.auditData.resourceType = resourceType
      req.auditData.resourceId = req.params.id || req.body?.id?.toString()
    }

    // Log successful requests
    const originalSend = res.send
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user?.id) {
        // Log successful action
        AuditService.logDataAccess(
          req.user.id,
          action as any,
          resourceType,
          req.auditData?.resourceId,
          req.auditData?.details,
          req.auditData?.details?.ipAddress,
          req.auditData?.details?.userAgent,
          true
        ).catch(console.error)
      }
      return originalSend.call(this, data)
    }

    // Log failed requests
    const originalJson = res.json
    res.json = function(data) {
      if (res.statusCode >= 400 && req.user?.id) {
        // Log failed action
        AuditService.logDataAccess(
          req.user.id,
          action as any,
          resourceType,
          req.auditData?.resourceId,
          {
            ...req.auditData?.details,
            error: data.message || 'Unknown error',
            statusCode: res.statusCode
          },
          req.auditData?.details?.ipAddress,
          req.auditData?.details?.userAgent,
          false,
          data.message || 'Unknown error'
        ).catch(console.error)
      }
      return originalJson.call(this, data)
    }

    next()
  }
}

/**
 * Middleware to log authentication events
 */
export const logAuthEvent = (action: 'login' | 'logout' | 'login_failed') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send
    res.send = function(data) {
      if (req.user?.id) {
        const success = res.statusCode >= 200 && res.statusCode < 300
        AuditService.logAuth(
          req.user.id,
          action,
          req.auditData?.details?.ipAddress,
          req.auditData?.details?.userAgent,
          success,
          success ? undefined : data.message
        ).catch(console.error)
      }
      return originalSend.call(this, data)
    }

    next()
  }
}

/**
 * Middleware to log user management events
 */
export const logUserManagement = (action: 'user_create' | 'user_update' | 'user_delete' | 'user_activate' | 'user_deactivate' | 'role_change') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send
    res.send = function(data) {
      if (req.user?.id) {
        const success = res.statusCode >= 200 && res.statusCode < 300
        const targetUserId = req.params.id || req.body?.id || req.body?.userId
        
        AuditService.logUserManagement(
          req.user.id,
          action,
          parseInt(targetUserId) || 0,
          {
            ...req.auditData?.details,
            requestBody: req.body,
            responseData: success ? data : undefined
          },
          req.auditData?.details?.ipAddress,
          req.auditData?.details?.userAgent,
          success,
          success ? undefined : data.message
        ).catch(console.error)
      }
      return originalSend.call(this, data)
    }

    next()
  }
}

/**
 * Middleware to log security events
 */
export const logSecurityEvent = (action: 'unauthorized_access' | 'permission_denied' | 'suspicious_activity') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send
    res.send = function(data) {
      if (req.user?.id) {
        AuditService.logSecurity(
          req.user.id,
          action,
          req.auditData?.resourceType || 'unknown',
          req.auditData?.resourceId,
          {
            ...req.auditData?.details,
            error: data.message || 'Security event',
            statusCode: res.statusCode
          },
          req.auditData?.details?.ipAddress,
          req.auditData?.details?.userAgent,
          data.message
        ).catch(console.error)
      }
      return originalSend.call(this, data)
    }

    next()
  }
}

/**
 * Middleware to log failed authentication attempts
 */
export const logFailedAuth = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send
  res.send = function(data) {
    if (res.statusCode >= 400) {
      // Try to extract user info from request body
      const username = req.body?.username || req.body?.email || 'unknown'
      
      // Create a temporary user ID for failed auth attempts
      const tempUserId = 0 // Use 0 for failed auth attempts
      
      AuditService.logAuth(
        tempUserId,
        'login_failed',
        req.auditData?.details?.ipAddress,
        req.auditData?.details?.userAgent,
        false,
        data.message || 'Authentication failed'
      ).catch(console.error)
    }
    return originalSend.call(this, data)
  }

  next()
}
