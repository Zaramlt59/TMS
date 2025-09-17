import { Request, Response } from 'express'
import { UserManagementService } from '../services/userManagementService'

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserManagementService.getAllUsers()
    res.json({ success: true, data: users })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
}

/**
 * Create a new user
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const user = await UserManagementService.createUser(userData)
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    })
  }
}

/**
 * Update user information
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    const user = await UserManagementService.updateUser(Number(id), updateData)
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    })
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    })
  }
}

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserManagementService.toggleUserStatus(Number(id))
    
    res.json({
      success: true,
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
      data: user
    })
  } catch (error: any) {
    console.error('Error toggling user status:', error)
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    })
  }
}

/**
 * Update user role
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { role } = req.body
    
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      })
    }
    
    const user = await UserManagementService.updateUserRole(Number(id), role)
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    })
  } catch (error: any) {
    console.error('Error updating user role:', error)
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    })
  }
}

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await UserManagementService.deleteUser(Number(id))
    
    res.json({
      success: true,
      message: result.message
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
}