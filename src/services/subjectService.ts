import prisma from './prismaService'

export const subjectService = {
  // Get all subjects
  async getAll(): Promise<any[]> {
    try {
      return await prisma.subjects.findMany({
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching subjects:', error)
      throw new Error('Failed to fetch subjects')
    }
  },

  // Get subject by ID
  async getById(id: number): Promise<any | null> {
    try {
      return await prisma.subjects.findUnique({
        where: { id }
      })
    } catch (error) {
      console.error('Error fetching subject by ID:', error)
      throw new Error('Failed to fetch subject')
    }
  },

  // Get subject by code
  async getByCode(code: string): Promise<any | null> {
    try {
      return await prisma.subjects.findFirst({
        where: { code }
      })
    } catch (error) {
      console.error('Error fetching subject by code:', error)
      throw new Error('Failed to fetch subject')
    }
  },

  // Create new subject
  async create(data: any): Promise<any> {
    try {
      return await prisma.subjects.create({
        data
      })
    } catch (error) {
      console.error('Error creating subject:', error)
      throw new Error('Failed to create subject')
    }
  },

  // Update subject
  async update(id: number, data: any): Promise<any> {
    try {
      return await prisma.subjects.update({
        where: { id },
        data
      })
    } catch (error) {
      console.error('Error updating subject:', error)
      throw new Error('Failed to update subject')
    }
  },

  // Delete subject
  async delete(id: number): Promise<any> {
    try {
      return await prisma.subjects.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error deleting subject:', error)
      throw new Error('Failed to delete subject')
    }
  }
}
