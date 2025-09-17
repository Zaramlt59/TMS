import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // First try to get users with last_login field
    let users;
    try {
      users = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          last_login: true as any, // Type assertion for field that may not exist yet
          created_at: true
        } as any as any,
        orderBy: {
          created_at: 'desc'
        }
      })
    } catch (error: any) {
      // If last_login field doesn't exist, get users without it
      console.log('last_login field not found, falling back to basic user query')
      users = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          created_at: true
        },
        orderBy: {
          created_at: 'desc'
        }
      })
    }

    // Get last login from audit_logs for users without last_login field
    const usersWithLastLogin = await Promise.all(users.map(async (user) => {
      if (!user.last_login) {
        try {
          const lastLoginLog = await prisma.audit_logs.findFirst({
            where: {
              user_id: user.id,
              action: 'login',
              success: true
            },
            orderBy: {
              created_at: 'desc'
            },
            select: {
              created_at: true
            }
          })
          
          return {
            ...user,
            last_login: lastLoginLog?.created_at || null
          }
        } catch (error) {
          // If audit_logs query fails, return user without last_login
          return user
        }
      }
      return user
    }))

    res.json({
      success: true,
      data: usersWithLastLogin
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
}

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, role, password, is_active = true, phone, school_id, district, rd_block } = req.body

    // Validate required fields
    if (!username || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, role, and password are required'
      })
    }

    // Validate role
    const validRoles = ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      })
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { username }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    let user;
    try {
      user = await prisma.users.create({
        data: {
          username,
          email,
          role,
          password: hashedPassword,
          is_active,
          phone,
          school_id,
          district,
          rd_block
        },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          last_login: true as any, // Type assertion for field that may not exist yet
          created_at: true
        } as any
      })
    } catch (error: any) {
      // If last_login field doesn't exist, create without it
      user = await prisma.users.create({
        data: {
          username,
          email,
          role,
          password: hashedPassword,
          is_active,
          phone,
          school_id,
          district,
          rd_block
        },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          created_at: true
        }
      })
    }

    res.json({
      success: true,
      data: user,
      message: 'User created successfully'
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    })
  }
}

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { username, email, role, password, is_active, phone, school_id, district, rd_block } = req.body

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher']
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
        })
      }
    }

    // Prepare update data
    const updateData: any = {
      username,
      email,
      role,
      is_active,
      phone,
      school_id,
      district,
      rd_block
    }

    // Only hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user
    let user;
    try {
      user = await prisma.users.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          last_login: true as any, // Type assertion for field that may not exist yet
          created_at: true
        } as any
      })
    } catch (error: any) {
      // If last_login field doesn't exist, update without it
      user = await prisma.users.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          created_at: true
        }
      })
    }

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    })
  }
}

// Toggle user status
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Toggle status
    let user;
    try {
      user = await prisma.users.update({
        where: { id: parseInt(id) },
        data: {
          is_active: !existingUser.is_active
        },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          last_login: true as any, // Type assertion for field that may not exist yet
          created_at: true
        } as any
      })
    } catch (error: any) {
      // If last_login field doesn't exist, update without it
      user = await prisma.users.update({
        where: { id: parseInt(id) },
        data: {
          is_active: !existingUser.is_active
        },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          created_at: true
        }
      })
    }

    res.json({
      success: true,
      data: user,
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`
    })
  } catch (error: any) {
    console.error('Error toggling user status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    })
  }
}

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Validate role
    const validRoles = ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      })
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update user role
    let user;
    try {
      user = await prisma.users.update({
        where: { id: parseInt(id) },
        data: { role },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          last_login: true as any, // Type assertion for field that may not exist yet
          created_at: true
        } as any
      })
    } catch (error: any) {
      // If last_login field doesn't exist, update without it
      user = await prisma.users.update({
        where: { id: parseInt(id) },
        data: { role },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          is_active: true,
          school_id: true,
          district: true,
          rd_block: true,
          created_at: true
        }
      })
    }

    res.json({
      success: true,
      data: user,
      message: 'User role updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating user role:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    })
  }
}

// Delete user (now uses safe deletion)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Use safe deletion
    const { cascadeService } = await import('../services/cascadeService')
    const force = req.query.force === 'true'
    const result = await cascadeService.safeDeleteUser(parseInt(id), force)
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.cascadeInfo
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        data: result.cascadeInfo,
        error: result.error
      })
    }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
}
