import prisma from './prismaService'

export const districtService = {
  // Get all active districts
  async getAllActive(): Promise<any[]> {
    try {
      return await prisma.districts.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching active districts:', error)
      throw new Error('Failed to fetch districts')
    }
  },

  // Get all districts (including inactive)
  async getAll(): Promise<any[]> {
    try {
      return await prisma.districts.findMany({
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching all districts:', error)
      throw new Error('Failed to fetch districts')
    }
  },

  // Get district by ID
  async getById(id: number): Promise<any | null> {
    try {
      return await prisma.districts.findUnique({
        where: { id },
        include: {
          rd_blocks: true
        }
      })
    } catch (error) {
      console.error('Error fetching district by ID:', error)
      throw new Error('Failed to fetch district')
    }
  },

  // Create new district
  async create(data: any): Promise<any> {
    try {
      return await prisma.districts.create({
        data
      })
    } catch (error) {
      console.error('Error creating district:', error)
      throw new Error('Failed to create district')
    }
  },

  // Update district
  async update(id: number, data: any): Promise<any> {
    try {
      return await prisma.districts.update({
        where: { id },
        data
      })
    } catch (error) {
      console.error('Error updating district:', error)
      throw new Error('Failed to update district')
    }
  },

  // Soft delete district
  async delete(id: number): Promise<any> {
    try {
      return await prisma.districts.update({
        where: { id },
        data: { is_active: false }
      })
    } catch (error) {
      console.error('Error deleting district:', error)
      throw new Error('Failed to delete district')
    }
  },

  // Hard delete district
  async hardDelete(id: number): Promise<any> {
    try {
      return await prisma.districts.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error hard deleting district:', error)
      throw new Error('Failed to delete district')
    }
  }
} 