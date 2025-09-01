import prisma from './prismaService'

export const teacherService = {
  // Get all teachers
  async getAll(): Promise<any[]> {
    try {
      const teachers = await prisma.teachers.findMany({
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        },
        orderBy: { teacher_name: 'asc' }
      })
      
      // Transform relation field names for frontend
      return teachers.map(teacher => this.transformRelationsForFrontend(teacher))
    } catch (error) {
      console.error('Error fetching all teachers:', error)
      throw new Error('Failed to fetch teachers')
    }
  },

  // Get teachers by district
  async getByDistrict(district: string): Promise<any[]> {
    try {
      const teachers = await prisma.teachers.findMany({
        where: { 
          district: district
        },
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        },
        orderBy: { teacher_name: 'asc' }
      })
      
      // Transform relation field names for frontend
      return teachers.map(teacher => this.transformRelationsForFrontend(teacher))
      } catch (error) {
      console.error('Error fetching teachers by district:', error)
      throw new Error('Failed to fetch teachers by district')
    }
  },

  // Get teachers by subject
  async getBySubject(subject: string): Promise<any[]> {
    try {
      const teachers = await prisma.teachers.findMany({
        where: { 
          subjects_taught: {
            contains: subject
          }
        },
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        },
        orderBy: { teacher_name: 'asc' }
      })
      
      // Transform relation field names for frontend
      return teachers.map(teacher => this.transformRelationsForFrontend(teacher))
    } catch (error) {
      console.error('Error fetching teachers by subject:', error)
      throw new Error('Failed to fetch teachers by subject')
    }
  },

  // Get teachers by school
  async getBySchool(schoolId: string): Promise<any[]> {
    try {
      const teachers = await prisma.teachers.findMany({
        where: { 
          school_id: schoolId
        },
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        },
        orderBy: { teacher_name: 'asc' }
      })
      
      // Transform relation field names for frontend
      return teachers.map(teacher => this.transformRelationsForFrontend(teacher))
    } catch (error) {
      console.error('Error fetching teachers by school:', error)
      throw new Error('Failed to fetch teachers by school')
    }
  },

  // Get teacher by ID
  async getById(id: number): Promise<any | null> {
    try {
      const teacher = await prisma.teachers.findUnique({
        where: { id },
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        }
      })
      
      if (teacher) {
        // Transform database values back to frontend display values
        return this.transformTeacherDataForFrontend(teacher)
      }
      
      return teacher
    } catch (error) {
      console.error('Error fetching teacher by ID:', error)
      throw new Error('Failed to fetch teacher')
    }
  },

  // Search teachers
  async search(query: string): Promise<any[]> {
    try {
      const teachers = await prisma.teachers.findMany({
        where: {
          OR: [
            { teacher_name: { contains: query } },
            { phone_number: { contains: query } },
            { email: { contains: query } }
          ]
        },
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        },
        orderBy: { teacher_name: 'asc' }
      })
      
      // Transform relation field names for frontend
      return teachers.map(teacher => this.transformRelationsForFrontend(teacher))
          } catch (error) {
      console.error('Error searching teachers:', error)
      throw new Error('Failed to search teachers')
    }
  },

  // Create new teacher
  async create(data: any): Promise<any> {
    try {
      const transformedData = this.transformTeacherData(data)
      return await prisma.teachers.create({
        data: transformedData
      })
          } catch (error) {
      console.error('Error creating teacher:', error)
      throw new Error('Failed to create teacher')
    }
  },

  // Update teacher
  async update(id: number, data: any): Promise<any> {
    try {
      const transformedData = this.transformTeacherData(data)
      return await prisma.teachers.update({
        where: { id },
        data: transformedData
      })
          } catch (error) {
      console.error('Error updating teacher:', error)
      throw new Error('Failed to update teacher')
    }
  },

  // Delete teacher
  async delete(id: number): Promise<any> {
    try {
      return await prisma.teachers.delete({
        where: { id }
      })
      } catch (error) {
      console.error('Error deleting teacher:', error)
      throw new Error('Failed to delete teacher')
    }
  },

  // Get teacher statistics
  async getStats(): Promise<any> {
    try {
      const [total, male, female] = await Promise.all([
        prisma.teachers.count(),
        prisma.teachers.count({ where: { gender: 'Male' } }),
        prisma.teachers.count({ where: { gender: 'Female' } })
      ])

      return { total, male, female }
    } catch (error) {
      console.error('Error fetching teacher statistics:', error)
      throw new Error('Failed to fetch teacher statistics')
    }
  },

  // Transform frontend data to match database schema
  transformTeacherData(data: any): any {
    const transformed: any = {}
    
    // Map frontend field names to database field names
    if (data.teacher_name !== undefined) transformed.teacher_name = data.teacher_name
    if (data.date_of_birth !== undefined) {
      // Convert date string to ISO DateTime format for Prisma
      const date = new Date(data.date_of_birth)
      transformed.date_of_birth = date.toISOString()
    }
    if (data.joining_date !== undefined) {
      // Convert date string to ISO DateTime format for Prisma
      const date = new Date(data.joining_date)
      transformed.joining_date = date.toISOString()
    }
    if (data.phone_number !== undefined) transformed.phone_number = data.phone_number
    if (data.email !== undefined) transformed.email = data.email
    if (data.social_group !== undefined) transformed.social_group = data.social_group
    if (data.religion !== undefined) transformed.religion = data.religion
    if (data.gender !== undefined) transformed.gender = data.gender
    if (data.aadhaar_number !== undefined) transformed.aadhaar_number = data.aadhaar_number
    if (data.subjects_taught !== undefined) transformed.subjects_taught = data.subjects_taught
    if (data.classes_taught !== undefined) transformed.classes_taught = data.classes_taught
    if (data.school_id !== undefined) transformed.school_id = data.school_id
    if (data.current_school_name !== undefined) transformed.current_school_name = data.current_school_name
    if (data.school_level !== undefined) transformed.school_level = data.school_level
    if (data.management !== undefined) {
      // Convert spaces to underscores for enum values
      transformed.management = data.management.replace(/\s+/g, '_')
    }
    if (data.medium !== undefined) transformed.medium = data.medium
    if (data.habitation !== undefined) transformed.habitation = data.habitation
    if (data.pincode !== undefined) transformed.pincode = data.pincode
    if (data.district !== undefined) transformed.district = data.district
    if (data.rd_block !== undefined) transformed.rd_block = data.rd_block
    if (data.school_phone !== undefined) transformed.school_phone = data.school_phone
    if (data.habitation_class !== undefined) transformed.habitation_class = data.habitation_class
    if (data.habitation_category !== undefined) transformed.habitation_category = data.habitation_category
    if (data.block_office !== undefined) {
      // Convert spaces to underscores for enum values
      transformed.block_office = data.block_office.replace(/\s+/g, '_')
    }
    
    return transformed
  },

  // Transform database values back to frontend display values
  transformTeacherDataForFrontend(data: any): any {
    const transformed: any = {}

    // Map database field names to frontend field names
    if (data.teacher_name !== undefined) transformed.teacher_name = data.teacher_name
    if (data.date_of_birth !== undefined) {
      // Convert ISO DateTime string to date string for frontend
      const date = new Date(data.date_of_birth)
      transformed.date_of_birth = date.toISOString().split('T')[0] // YYYY-MM-DD
    }
    if (data.joining_date !== undefined) {
      // Convert ISO DateTime string to date string for frontend
      const date = new Date(data.joining_date)
      transformed.joining_date = date.toISOString().split('T')[0] // YYYY-MM-DD
    }
    if (data.phone_number !== undefined) transformed.phone_number = data.phone_number
    if (data.email !== undefined) transformed.email = data.email
    if (data.social_group !== undefined) transformed.social_group = data.social_group
    if (data.religion !== undefined) transformed.religion = data.religion
    if (data.gender !== undefined) transformed.gender = data.gender
    if (data.aadhaar_number !== undefined) transformed.aadhaar_number = data.aadhaar_number
    if (data.subjects_taught !== undefined) transformed.subjects_taught = data.subjects_taught
    if (data.classes_taught !== undefined) transformed.classes_taught = data.classes_taught
    if (data.school_id !== undefined) transformed.school_id = data.school_id
    if (data.current_school_name !== undefined) transformed.current_school_name = data.current_school_name
    if (data.school_level !== undefined) transformed.school_level = data.school_level
    if (data.management !== undefined) {
      // Convert underscores back to spaces for enum values
      transformed.management = data.management.replace(/_/g, ' ')
    }
    if (data.medium !== undefined) transformed.medium = data.medium
    if (data.habitation !== undefined) transformed.habitation = data.habitation
    if (data.pincode !== undefined) transformed.pincode = data.pincode
    if (data.district !== undefined) transformed.district = data.district
    if (data.rd_block !== undefined) transformed.rd_block = data.rd_block
    if (data.school_phone !== undefined) transformed.school_phone = data.school_phone
    if (data.habitation_class !== undefined) transformed.habitation_class = data.habitation_class
    if (data.habitation_category !== undefined) transformed.habitation_category = data.habitation_category
    if (data.block_office !== undefined) {
      // Convert underscores back to spaces for enum values
      transformed.block_office = data.block_office.replace(/_/g, ' ')
    }
    
    // Preserve relations data
    if (data.posting_histories !== undefined) transformed.posting_history = data.posting_histories
    if (data.deputations !== undefined) transformed.deputation = data.deputations
    if (data.attachments !== undefined) transformed.attachment = data.attachments
    
    return transformed
  },

  // Helper function to transform relation field names for frontend
  transformRelationsForFrontend(data: any): any {
    const transformed = { ...data }
    
    // Map relation field names to frontend field names
    if (data.posting_histories !== undefined) transformed.posting_history = data.posting_histories
    if (data.deputations !== undefined) transformed.deputation = data.deputations
    if (data.attachments !== undefined) transformed.attachment = data.attachments
    
    return transformed
  }
}
