import prisma from './prismaService'

export const schoolService = {
  // Get all schools with optional role-based filtering
  async getAll(params?: { page: number; limit: number; roleFilters?: any }): Promise<any> {
    try {
      const page = params?.page || 1
      const limit = params?.limit || 20
      const skip = (page - 1) * limit

      // Build where clause with role-based filters
      const whereClause = this.buildWhereClause(params?.roleFilters)

      const [rows, total] = await Promise.all([
        prisma.schools.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { school_name: 'asc' },
          select: {
            id: true,
            school_id: true,
            school_name: true,
            school_type: true,
            school_level: true,
            management: true,
            medium: true,
            pincode: true,
            district: true,
            rd_block: true,
            school_phone: true,
            school_email: true,
            habitation: true,
            habitation_class: true,
            habitation_category: true,
            block_office: true,
            created_at: true,
            updated_at: true
          }
        }),
        prisma.schools.count({ where: whereClause })
      ])

      return {
        success: true,
        message: 'Schools retrieved successfully',
        data: rows.map(r => this.transformSchoolDataForFrontend(r)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Error fetching all schools:', error)
      return { success: false, message: 'Failed to fetch schools' }
    }
  },

  // Build where clause for role-based filtering
  buildWhereClause(roleFilters?: any) {
    const whereClause: any = {
      // Exclude soft-deleted records
      deleted_at: null
    };

    if (roleFilters) {
      // Apply school_id filter
      if (roleFilters.school_id && roleFilters.school_id.trim() !== '') {
        whereClause.school_id = roleFilters.school_id;
      }

      // Apply district filter
      if (roleFilters.district && roleFilters.district.trim() !== '') {
        whereClause.district = roleFilters.district;
      }

      // Apply rd_block filter
      if (roleFilters.rd_block && roleFilters.rd_block.trim() !== '') {
        whereClause.rd_block = roleFilters.rd_block;
      }
    }

    return whereClause;
  },

  // Get schools by district
  async getByDistrict(district: string): Promise<any[]> {
    try {
      const schools = await prisma.schools.findMany({
        where: { 
          district: district,
          deleted_at: null
        } as any,
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
          rd_block: rdBlock,
          deleted_at: null
        } as any,
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
          school_type: schoolType,
          deleted_at: null
        } as any,
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
          management: management,
          deleted_at: null
        } as any,
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
          medium: medium,
          deleted_at: null
        } as any,
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
          ],
          deleted_at: null
        } as any,
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
      const school = await prisma.schools.findFirst({
        where: { 
          id,
          deleted_at: null
        } as any
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
      const school = await prisma.schools.findFirst({
        where: { 
          school_id: schoolId,
          deleted_at: null
        } as any
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
    } catch (error: any) {
      console.error('Error creating school:', error)
      const msg = error?.message || 'Failed to create school'
      if (msg.startsWith('Please select')) throw error
      throw new Error(msg)
    }
  },

  // Update school
  async update(id: number, data: any): Promise<any> {
    try {
      return await prisma.schools.update({
        where: { id },
        data: this.transformSchoolData(data)
      })
    } catch (error: any) {
      console.error('Error updating school:', error)
      const msg = error?.message || 'Failed to update school'
      if (msg.startsWith('Please select')) throw error
      throw new Error(msg)
    }
  },

  // Update school by school_id (business identifier)
  async updateBySchoolId(schoolId: string, data: any): Promise<any> {
    try {
      return await prisma.schools.update({
        where: { school_id: schoolId },
        data: this.transformSchoolData(data)
      })
    } catch (error: any) {
      console.error('Error updating school by school_id:', error)
      const msg = error?.message || 'Failed to update school'
      if (msg.startsWith('Please select')) throw error
      throw new Error(msg)
    }
  },

  // Delete school (soft delete)
  async delete(id: number): Promise<any> {
    try {
      return await prisma.schools.update({
        where: { id },
        data: { 
          deleted_at: new Date(),
          updated_at: new Date()
        } as any
      })
    } catch (error) {
      console.error('Error deleting school:', error)
      throw new Error('Failed to delete school')
    }
  },

  // Delete school by school_id (business identifier) - soft delete
  async deleteBySchoolId(schoolId: string): Promise<any> {
    try {
      return await prisma.schools.update({
        where: { school_id: schoolId },
        data: { 
          deleted_at: new Date(),
          updated_at: new Date()
        } as any
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
        prisma.schools.count({ where: { deleted_at: null } as any }),
        prisma.schools.findMany({
          where: { deleted_at: null } as any,
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

    const str = (v: any) => (v !== undefined && v !== null && typeof v === 'string' ? v : '')
    const placeholderManagement = /^Select\s+management\s+type$/i
    const placeholderBlockOffice = /^Select\s+block\s+office$/i

    // Map frontend field names to database field names
    if (data.school_id !== undefined) transformed.school_id = data.school_id
    if (data.school_name !== undefined) transformed.school_name = data.school_name
    if (data.school_type !== undefined) {
      if (data.school_type === 'Co-educational') {
        transformed.school_type = 'Co_educational'
      } else {
        transformed.school_type = data.school_type
      }
    }
    if (data.school_level !== undefined) transformed.school_level = data.school_level
    if (data.management !== undefined) {
      const m = str(data.management)
      if (!m || placeholderManagement.test(m)) {
        throw new Error('Please select a management type.')
      }
      transformed.management = m.replace(/\s+/g, '_')
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
      const b = str(data.block_office)
      if (!b || placeholderBlockOffice.test(b)) {
        throw new Error('Please select a block office.')
      }
      if (data.block_office === 'Education Office(CADC)') {
        transformed.block_office = 'Education_Office_CADC_'
      } else if (data.block_office === 'Education Office (LADC)') {
        transformed.block_office = 'Education_Office__LADC_'
      } else if (data.block_office === 'Education Office (MADC)') {
        transformed.block_office = 'Education_Office__MADC_'
      } else {
        transformed.block_office = b.replace(/\s+/g, '_')
      }
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
      // Handle special cases for Education Office entries
      if (data.block_office === 'Education_Office_CADC_') {
        transformed.block_office = 'Education Office(CADC)'
      } else if (data.block_office === 'Education_Office__LADC_') {
        transformed.block_office = 'Education Office (LADC)'
      } else if (data.block_office === 'Education_Office__MADC_') {
        transformed.block_office = 'Education Office (MADC)'
      } else {
        // Convert underscores to spaces for other enum values
        transformed.block_office = data.block_office.replace(/_/g, ' ')
      }
    }
    
    return transformed
  }
}
