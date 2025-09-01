import prisma from './prismaService'

export const schoolService = {
  // Get all schools
  async getAll(): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        orderBy: { school_name: 'asc' }
      })
      
      // Transform database values to frontend display values
      return schools.map(school => this.transformSchoolDataForFrontend(school))
    } catch (error) {
      console.error('Error fetching all schools:', error)
      throw new Error('Failed to fetch schools')
    }
  },

  // Get schools by district
  async getByDistrict(district: string): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        where: { 
          district: district
        },
        orderBy: { school_name: 'asc' }
      })
      
      // Transform database values to frontend display values
      return schools.map(school => this.transformSchoolDataForFrontend(school))
    } catch (error) {
      console.error('Error fetching schools by district:', error)
      throw new Error('Failed to fetch schools by district')
    }
  },

  // Get schools by RD block
  async getByRdBlock(rdBlock: string): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        where: { 
          rd_block: rdBlock
        },
        orderBy: { school_name: 'asc' }
      })
      
      // Transform database values to frontend display values
      return schools.map(school => this.transformSchoolDataForFrontend(school))
    } catch (error) {
      console.error('Error fetching schools by RD block:', error)
      throw new Error('Failed to fetch schools by RD block')
    }
  },

  // Get schools by school type
  async getBySchoolType(schoolType: any): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        where: { 
          school_type: schoolType
        },
        orderBy: { school_name: 'asc' }
      })
      
      // Transform database values to frontend display values
      return schools.map(school => this.transformSchoolDataForFrontend(school))
    } catch (error) {
      console.error('Error fetching schools by school type:', error)
      throw new Error('Failed to fetch schools by school type')
    }
  },

  // Get schools by management type
  async getByManagement(management: any): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        where: { 
          management: management
        },
        orderBy: { school_name: 'asc' }
      })
      
      // Transform database values to frontend display values
      return schools.map(school => this.transformSchoolDataForFrontend(school))
    } catch (error) {
      console.error('Error fetching schools by management:', error)
      throw new Error('Failed to fetch schools by management')
    }
  },

  // Get schools by medium
  async getByMedium(medium: any): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        where: { 
          medium: medium
        },
        orderBy: { school_name: 'asc' }
      })
      
      // Transform database values to frontend display values
      return schools.map(school => this.transformSchoolDataForFrontend(school))
    } catch (error) {
      console.error('Error fetching schools by medium:', error)
      throw new Error('Failed to fetch schools by medium')
    }
  },

  // Search schools
  async search(query: string): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        where: {
          OR: [
            { school_name: { contains: query } },
            { school_id: { contains: query } }
          ]
        },
        orderBy: { school_name: 'asc' }
      })
      
      // Transform database values to frontend display values
      return schools.map(school => this.transformSchoolDataForFrontend(school))
    } catch (error) {
      console.error('Error searching schools:', error)
      throw new Error('Failed to search schools')
    }
  },

  // Get school by ID
  async getById(id: number): Promise<any | null> {
    try {
      const school = await prisma.schools.findUnique({
        where: { id }
      })
      
      if (school) {
        // Transform database values back to frontend display values
        return this.transformSchoolDataForFrontend(school)
      }
      
      return school
    } catch (error) {
      console.error('Error fetching school by ID:', error)
      throw new Error('Failed to fetch school')
    }
  },

  // Get school by school_id (business identifier)
  async getBySchoolId(schoolId: string): Promise<any | null> {
    try {
      const school = await prisma.schools.findUnique({
        where: { school_id: schoolId }
      })
      
      if (school) {
        // Transform database values back to frontend display values
        return this.transformSchoolDataForFrontend(school)
      }
      
      return school
    } catch (error) {
      console.error('Error fetching school by school_id:', error)
      throw new Error('Failed to fetch school')
    }
  },

  // Create new school
  async create(data: any): Promise<any> {
    try {
      return await prisma.schools.create({
        data: this.transformSchoolData(data)
      })
    } catch (error) {
      console.error('Error creating school:', error)
      throw new Error('Failed to create school')
    }
  },

  // Update school
  async update(id: number, data: any): Promise<any> {
    try {
      return await prisma.schools.update({
        where: { id },
        data: this.transformSchoolData(data)
      })
    } catch (error) {
      console.error('Error updating school:', error)
      throw new Error('Failed to update school')
    }
  },

  // Update school by school_id (business identifier)
  async updateBySchoolId(schoolId: string, data: any): Promise<any> {
    try {
      return await prisma.schools.update({
        where: { school_id: schoolId },
        data: this.transformSchoolData(data)
      })
    } catch (error) {
      console.error('Error updating school by school_id:', error)
      throw new Error('Failed to update school')
    }
  },

  // Delete school
  async delete(id: number): Promise<any> {
    try {
      return await prisma.schools.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error deleting school:', error)
      throw new Error('Failed to delete school')
    }
  },

  // Delete school by school_id (business identifier)
  async deleteBySchoolId(schoolId: string): Promise<any> {
    try {
      return await prisma.schools.delete({
        where: { school_id: schoolId }
      })
    } catch (error) {
      console.error('Error deleting school by school_id:', error)
      throw new Error('Failed to delete school')
    }
  },

  // Get school statistics
  async getStats(): Promise<any> {
    try {
      const [totalSchools, uniqueDistricts] = await Promise.all([
        prisma.schools.count(),
        prisma.schools.findMany({
          select: { district: true },
          distinct: ['district']
        })
      ])

          return {
        totalSchools,
        uniqueDistricts: uniqueDistricts.length
      }
    } catch (error) {
      console.error('Error fetching school stats:', error)
      throw new Error('Failed to fetch school statistics')
    }
  },

  // Transform frontend data to match database schema
  transformSchoolData(data: any): any {
    const transformed: any = {}
    
    // Map frontend field names to database field names
    if (data.school_id !== undefined) transformed.school_id = data.school_id
    if (data.school_name !== undefined) transformed.school_name = data.school_name
    if (data.school_type !== undefined) {
      // Convert frontend enum values to database enum values
      if (data.school_type === 'Co-educational') {
        transformed.school_type = 'Co_educational'
          } else {
        transformed.school_type = data.school_type
      }
    }
    if (data.school_level !== undefined) transformed.school_level = data.school_level
    if (data.management !== undefined) {
      // Convert spaces to underscores for enum values
      transformed.management = data.management.replace(/\s+/g, '_')
    }
    if (data.medium !== undefined) transformed.medium = data.medium
    if (data.pincode !== undefined) transformed.pincode = data.pincode
    if (data.district !== undefined) transformed.district = data.district
    if (data.rd_block !== undefined) transformed.rd_block = data.rd_block
    if (data.school_phone !== undefined) transformed.school_phone = data.school_phone
    if (data.school_email !== undefined) transformed.school_email = data.school_email
    if (data.habitation !== undefined) transformed.habitation = data.habitation
    if (data.habitation_class !== undefined) transformed.habitation_class = data.habitation_class
    if (data.habitation_category !== undefined) transformed.habitation_category = data.habitation_category
    if (data.block_office !== undefined) {
      // Convert spaces to underscores for enum values
      transformed.block_office = data.block_office.replace(/\s+/g, '_')
    }
    
    return transformed
  },

  // Transform database values back to frontend display values
  transformSchoolDataForFrontend(data: any): any {
    const transformed: any = {}

    // Map database field names to frontend field names
    if (data.school_id !== undefined) transformed.school_id = data.school_id
    if (data.school_name !== undefined) transformed.school_name = data.school_name
    if (data.school_type !== undefined) {
      // Convert database enum values to frontend display values
      if (data.school_type === 'Co_educational') {
        transformed.school_type = 'Co-educational'
      } else {
        transformed.school_type = data.school_type
      }
    }
    if (data.school_level !== undefined) transformed.school_level = data.school_level
    if (data.management !== undefined) {
      // Convert underscores to spaces for enum values
      transformed.management = data.management.replace(/_/g, ' ')
    }
    if (data.medium !== undefined) transformed.medium = data.medium
    if (data.pincode !== undefined) transformed.pincode = data.pincode
    if (data.district !== undefined) transformed.district = data.district
    if (data.rd_block !== undefined) transformed.rd_block = data.rd_block
    if (data.school_phone !== undefined) transformed.school_phone = data.school_phone
    if (data.school_email !== undefined) transformed.school_email = data.school_email
    if (data.habitation !== undefined) transformed.habitation = data.habitation
    if (data.habitation_class !== undefined) transformed.habitation_class = data.habitation_class
    if (data.habitation_category !== undefined) transformed.habitation_category = data.habitation_category
    if (data.block_office !== undefined) {
      // Convert underscores to spaces for enum values
      transformed.block_office = data.block_office.replace(/_/g, ' ')
    }
    
    return transformed
  }
}
