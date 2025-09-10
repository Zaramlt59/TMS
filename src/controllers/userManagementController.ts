import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    res.json({
      success: true,
      data: users
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
    const { username, email, role, password, is_active = true } = req.body

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
    const user = await prisma.users.create({
      data: {
        username,
        email,
        role,
        password: hashedPassword,
        is_active
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true
      }
    })

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
    const { username, email, role, password, is_active } = req.body

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
      is_active
    }

    // Only hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true
      }
    })

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
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        is_active: !existingUser.is_active
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true
      }
    })

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

// Delete user
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

    // Delete user
    await prisma.users.delete({
      where: { id: parseInt(id) }
    })

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
}
