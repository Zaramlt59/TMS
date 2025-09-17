import { Request, Response, NextFunction } from 'express'

/**
 * Validate user creation data
 */
export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, role, password } = req.body

  // Check required fields
  if (!username || !email || !role || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, role, and password are required'
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    })
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    })
  }

  // Validate role
  const validRoles = ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher']
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be one of: ' + validRoles.join(', ')
    })
  }

  next()
}

/**
 * Validate user update data
 */
export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, role, password } = req.body

  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }
  }

  // Validate password strength if provided
  if (password && password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    })
  }

  // Validate role if provided
  if (role) {
    const validRoles = ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: ' + validRoles.join(', ')
      })
    }
  }

  next()
}

/**
 * Validate user ID parameter
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: 'Valid user ID is required'
    })
  }

  next()
}
