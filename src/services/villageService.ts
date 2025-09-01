import prisma from './prismaService'

export const villageService = {
  // Get all active villages
  async getAllActive(): Promise<any[]> {
    try {
      return await prisma.villages.findMany({
        where: { is_active: true },
        include: {
          rd_blocks: {
            include: {
              districts: true
            }
          }
        },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching active villages:', error)
      throw new Error('Failed to fetch villages')
    }
  },

  // Get all villages (including inactive)
  async getAll(): Promise<any[]> {
    try {
      return await prisma.villages.findMany({
        include: {
          rd_blocks: {
            include: {
              districts: true
            }
          }
        },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching all villages:', error)
      throw new Error('Failed to fetch villages')
    }
  },

  // Get villages by RD block
  async getByRdBlock(rdBlockId: number): Promise<any[]> {
    try {
      return await prisma.villages.findMany({
        where: { 
          rd_block_id: rdBlockId,
          is_active: true 
        },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching villages by RD block:', error)
      throw new Error('Failed to fetch villages by RD block')
    }
  },

  // Get villages by district
  async getByDistrict(districtId: number): Promise<any[]> {
    try {
      return await prisma.villages.findMany({
        where: { 
          rd_blocks: {
            district_id: districtId
          },
          is_active: true 
        },
        include: {
          rd_blocks: true
        },
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching villages by district:', error)
      throw new Error('Failed to fetch villages by district')
    }
  },

  // Get village by ID
  async getById(id: number): Promise<any | null> {
    try {
      return await prisma.villages.findUnique({
        where: { id },
        include: {
          rd_blocks: {
            include: {
              districts: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error fetching village by ID:', error)
      throw new Error('Failed to fetch village')
    }
  },

  // Create new village
  async create(data: any): Promise<any> {
    try {
      return await prisma.villages.create({
        data,
        include: {
          rd_blocks: {
            include: {
              districts: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error creating village:', error)
      throw new Error('Failed to create village')
    }
  },

  // Update village
  async update(id: number, data: any): Promise<any> {
    try {
      return await prisma.villages.update({
        where: { id },
        data,
        include: {
          rd_blocks: {
            include: {
              districts: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error updating village:', error)
      throw new Error('Failed to update village')
    }
  },

  // Soft delete village
  async delete(id: number): Promise<any> {
    try {
      return await prisma.villages.update({
        where: { id },
        data: { is_active: false }
      })
    } catch (error) {
      console.error('Error deleting village:', error)
      throw new Error('Failed to delete village')
    }
  },

  // Hard delete village
  async hardDelete(id: number): Promise<any> {
    try {
      return await prisma.villages.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error hard deleting village:', error)
      throw new Error('Failed to delete village')
    }
  }
}
