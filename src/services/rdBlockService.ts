import prisma from './prismaService'

export const rdBlockService = {
  // Get all active RD blocks
  async getAllActive(): Promise<any[]> {
    try {
      return await prisma.rd_blocks.findMany({
        where: { is_active: true },
        include: {
          districts: true
        },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching active RD blocks:', error)
      throw new Error('Failed to fetch RD blocks')
    }
  },

  // Get all RD blocks (including inactive)
  async getAll(): Promise<any[]> {
    try {
      return await prisma.rd_blocks.findMany({
        include: {
          districts: true
        },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching all RD blocks:', error)
      throw new Error('Failed to fetch RD blocks')
    }
  },

  // Get RD blocks by district
  async getByDistrict(districtId: number): Promise<any[]> {
    try {
      return await prisma.rd_blocks.findMany({
        where: { 
          district_id: districtId,
          is_active: true 
        },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching RD blocks by district:', error)
      throw new Error('Failed to fetch RD blocks by district')
    }
  },

  // Get RD block by ID
  async getById(id: number): Promise<any | null> {
    try {
      return await prisma.rd_blocks.findUnique({
        where: { id },
        include: {
          districts: true,
          villages: true
        }
      })
    } catch (error) {
      console.error('Error fetching RD block by ID:', error)
      throw new Error('Failed to fetch RD block')
    }
  },

  // Create new RD block
  async create(data: any): Promise<any> {
    try {
      return await prisma.rd_blocks.create({
        data,
        include: {
          districts: true
        }
      })
    } catch (error) {
      console.error('Error creating RD block:', error)
      throw new Error('Failed to create RD block')
    }
  },

  // Update RD block
  async update(id: number, data: any): Promise<any> {
    try {
      return await prisma.rd_blocks.update({
        where: { id },
        data,
        include: {
          districts: true
        }
      })
    } catch (error) {
      console.error('Error updating RD block:', error)
      throw new Error('Failed to update RD block')
    }
  },

  // Soft delete RD block
  async delete(id: number): Promise<any> {
    try {
      return await prisma.rd_blocks.update({
        where: { id },
        data: { is_active: false }
      })
    } catch (error) {
      console.error('Error deleting RD block:', error)
      throw new Error('Failed to delete RD block')
    }
  },

  // Hard delete RD block
  async hardDelete(id: number): Promise<any> {
    try {
      return await prisma.rd_blocks.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error hard deleting RD block:', error)
      throw new Error('Failed to hard delete RD block')
    }
  }
}
