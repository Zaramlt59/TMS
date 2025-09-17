import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export interface CreateUserData {
  username: string
  email: string
  role: string
  password: string
  is_active?: boolean
  phone?: string
  school_id?: string
  district?: string
  rd_block?: string
}

export interface UpdateUserData {
  username?: string
  email?: string
  role?: string
  password?: string
  is_active?: boolean
  phone?: string
  school_id?: string
  district?: string
  rd_block?: string
}

export class UserManagementService {
  /**
   * Get all users with optional filtering
   */
  static async getAllUsers() {
    return await prisma.users.findMany({
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
        last_login: true as any,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number) {
    return await prisma.users.findUnique({
      where: { id },
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
        last_login: true as any,
        created_at: true
      }
    })
  }

  /**
   * Create a new user
   */
  static async createUser(data: CreateUserData) {
    // Check if username or email already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email }
        ]
      }
    })

    if (existingUser) {
      throw new Error(
        existingUser.username === data.username 
          ? 'Username already exists' 
          : 'Email already exists'
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user
    return await prisma.users.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role as any,
        is_active: data.is_active ?? true,
        phone: data.phone,
        school_id: data.school_id,
        district: data.district,
        rd_block: data.rd_block
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
        last_login: true as any,
        created_at: true
      }
    })
  }

  /**
   * Update user information
   */
  static async updateUser(id: number, data: UpdateUserData) {
    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id }
    })

    if (!existingUser) {
      throw new Error('User not found')
    }

    // Check for username/email conflicts (excluding current user)
    if (data.username || data.email) {
      const conflictUser = await prisma.users.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(data.username ? [{ username: data.username }] : []),
                ...(data.email ? [{ email: data.email }] : [])
              ]
            }
          ]
        }
      })

      if (conflictUser) {
        throw new Error(
          conflictUser.username === data.username 
            ? 'Username already exists' 
            : 'Email already exists'
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      ...data,
      updated_at: new Date()
    }

    // Hash password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    return await prisma.users.update({
      where: { id },
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
        last_login: true as any,
        created_at: true
      }
    })
  }

  /**
   * Toggle user active status
   */
  static async toggleUserStatus(id: number) {
    const user = await prisma.users.findUnique({
      where: { id }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return await prisma.users.update({
      where: { id },
      data: {
        is_active: !user.is_active,
        updated_at: new Date()
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
        last_login: true as any,
        created_at: true
      }
    })
  }

  /**
   * Update user role
   */
  static async updateUserRole(id: number, role: string) {
    const user = await prisma.users.findUnique({
      where: { id }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return await prisma.users.update({
      where: { id },
      data: {
        role: role as any,
        updated_at: new Date()
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
        last_login: true as any,
        created_at: true
      }
    })
  }

  /**
   * Delete user
   */
  static async deleteUser(id: number) {
    const user = await prisma.users.findUnique({
      where: { id }
    })

    if (!user) {
      throw new Error('User not found')
    }

    await prisma.users.delete({
      where: { id }
    })

    return { message: 'User deleted successfully' }
  }
}
