import { Request, Response } from 'express'
import { authService } from '../services/authService'
import userService from '../services/userService'
import { JWTUtil } from '../utils/jwt'
import { randomUUID } from 'crypto'
import { isLocked, registerFailure, clearFailures } from '../utils/loginLockout'
import jwt from 'jsonwebtoken'
import { AuditService } from '../services/auditService'
import { getClientIP } from '../utils/ipExtractor'

const REFRESH_COOKIE_NAME = 'rt'
const CSRF_COOKIE_NAME = 'csrf'
const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TTL_DAYS || 7)

function setRefreshCookie(res: Response, token: string, expiresAt: Date) {
  const crossSite = process.env.CROSS_SITE_COOKIES === 'true'
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    // In production, cookies should be Secure. For cross-site flows, SameSite must be 'none'.
    secure: process.env.NODE_ENV !== 'development',
    sameSite: crossSite ? 'none' : 'lax',
    expires: expiresAt,
    path: '/'
  })
}

function setCsrfCookie(res: Response) {
  const csrf = randomUUID()
  res.cookie(CSRF_COOKIE_NAME, csrf, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  return csrf
}

export const authLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      })
    }
    // Get real client IP
    const clientIP = getClientIP(req)
    
    // Clear any existing failures for tests
    if (process.env.NODE_ENV === 'test') {
      clearFailures(username, clientIP)
    }
    
    // Check if account is locked (skip for tests)
    if (process.env.NODE_ENV !== 'test') {
      const lock = isLocked(username, clientIP)
      if (lock.locked) {
        // Log failed login attempt due to lockout
        await AuditService.logAuth(
          0, // Use 0 for failed auth attempts
          'login_failed',
          clientIP,
          req.headers['user-agent'] as string,
          false,
          `Account locked for ${Math.ceil(lock.msRemaining/1000)}s`
        )
        return res.status(429).json({ success: false, message: `Account temporarily locked. Try again in ${Math.ceil(lock.msRemaining/1000)}s` })
      }
    }
    const user = await userService.authenticateUser({ username, password })
    if (!user) {
      // Only register failures in non-test environments
      const state = process.env.NODE_ENV !== 'test' ? registerFailure(username, clientIP) : { locked: false, msRemaining: 0 }
      const msg = state.locked ? `Too many attempts. Locked for ${Math.ceil(state.msRemaining/1000)}s` : 'Invalid username or password'
      
      // Log failed login attempt
      await AuditService.logAuth(
        0, // Use 0 for failed auth attempts
        'login_failed',
        clientIP,
        req.headers['user-agent'] as string,
        false,
        msg
      )
      return res.status(401).json({ success: false, message: msg })
    }
    clearFailures(username, clientIP)

    const accessToken = JWTUtil.generateToken({
      userId: user.id,
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      school_id: (user as any).school_id,
      district: (user as any).district,
      rd_block: (user as any).rd_block
    })

    const { token: refreshToken, expiresAt } = await authService.issueRefreshToken({
      userId: user.id,
      ttlDays: REFRESH_TTL_DAYS,
      deviceId: req.body.deviceId,
      ip: clientIP,
      userAgent: req.headers['user-agent']
    })

    setRefreshCookie(res, refreshToken, expiresAt)
    const csrf = setCsrfCookie(res)

    // Update last login time
    await userService.updateLastLogin(user.id)

    // Log successful login
    await AuditService.logAuth(
      user.id,
      'login',
      clientIP,
      req.headers['user-agent'] as string,
      true
    )

    res.json({ success: true, message: 'Login successful', data: { user, token: accessToken, csrf } })
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message || 'Login failed' })
  }
}

export const authRefresh = async (req: Request, res: Response) => {
  try {
    // Get real client IP
    const clientIP = getClientIP(req)
    
    // CSRF validation
    const csrfHeader = (req.headers['x-csrf-token'] as string) || ''
    const csrfCookie = req.cookies?.[CSRF_COOKIE_NAME]
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      return res.status(403).json({ success: false, message: 'CSRF validation failed' })
    }

    const oldToken = req.cookies?.[REFRESH_COOKIE_NAME]
    if (!oldToken) return res.status(401).json({ success: false, message: 'Refresh token missing' })

    const rotated = await authService.rotateRefreshToken(oldToken, {
      ttlDays: REFRESH_TTL_DAYS,
      deviceId: req.body?.deviceId,
      ip: clientIP,
      userAgent: req.headers['user-agent']
    })
    if (!rotated) return res.status(401).json({ success: false, message: 'Invalid refresh token' })

    const user = await userService.getUserById(rotated.userId)
    if (!user) return res.status(401).json({ success: false, message: 'User not found' })

    const accessToken = JWTUtil.generateToken({
      userId: user.id,
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      school_id: (user as any).school_id,
      district: (user as any).district,
      rd_block: (user as any).rd_block
    })

    setRefreshCookie(res, rotated.token, rotated.expiresAt)
    const csrf = setCsrfCookie(res)
    res.json({ success: true, message: 'Token refreshed', data: { token: accessToken, csrf } })
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message || 'Refresh failed' })
  }
}

export const authLogout = async (req: Request, res: Response) => {
  try {
    // Get real client IP
    const clientIP = getClientIP(req)
    
    const token = req.cookies?.[REFRESH_COOKIE_NAME]
    if (token) await authService.revokeToken(token)
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' })
    res.clearCookie(CSRF_COOKIE_NAME, { path: '/' })
    
    // Log logout if user is authenticated
    if (req.user?.id) {
      await AuditService.logAuth(
        req.user.id,
        'logout',
        clientIP,
        req.headers['user-agent'] as string,
        true
      )
    }
    
    res.json({ success: true, message: 'Logged out' })
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message || 'Logout failed' })
  }
}

// Password reset - request token (in production, email this token)
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {}
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' })
    // Find user by email
    const users = await userService.getAllUsers()
    const user = users.find(u => u.email?.toLowerCase() === String(email).toLowerCase())
    if (!user) {
      // Do not reveal user existence
      return res.json({ success: true, message: 'If account exists, a reset link has been issued' })
    }
    const secret = process.env.JWT_SECRET || 'change-me'
    const token = jwt.sign({ userId: user.id, purpose: 'pwd_reset' }, secret, { expiresIn: '15m' })
    // In real deployment: send via email. For now, return for testing.
    res.json({ success: true, message: 'Password reset token issued', data: { token } })
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message || 'Failed to issue reset token' })
  }
}

// Password reset - consume token and set new password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body || {}
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and password are required' })
    const secret = process.env.JWT_SECRET || 'change-me'
    const payload = jwt.verify(token, secret) as any
    if (!payload || payload.purpose !== 'pwd_reset' || !payload.userId) {
      return res.status(400).json({ success: false, message: 'Invalid token' })
    }
    // Update password and revoke all refresh tokens
    const updated = await userService.updateUser(Number(payload.userId), { password })
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' })
    await authService.revokeAllForUser(Number(payload.userId))
    res.json({ success: true, message: 'Password updated successfully' })
  } catch (e: any) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' })
  }
}


