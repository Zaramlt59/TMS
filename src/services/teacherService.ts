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
      
      // Extract related data
      const { posting_histories, deputations, attachments, ...teacherData } = transformedData
      
      // Create teacher with related records
      const teacher = await prisma.teachers.create({
        data: {
          ...teacherData,
          posting_histories: {
            create: posting_histories || []
          },
          deputations: {
            create: deputations || []
          },
          attachments: {
            create: attachments || []
          }
        },
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        }
      })
      
      return this.transformRelationsForFrontend(teacher)
    } catch (error) {
      console.error('Error creating teacher:', error)
      throw new Error('Failed to create teacher')
    }
  },

  // Update teacher
  async update(id: number, data: any): Promise<any> {
    try {
      const transformedData = this.transformTeacherData(data)
      
      // Extract related data
      const { posting_histories, deputations, attachments, ...teacherData } = transformedData
      
      // First, delete existing related records
      await prisma.posting_histories.deleteMany({
        where: { teacher_id: id }
      })
      await prisma.deputations.deleteMany({
        where: { teacher_id: id }
      })
      await prisma.attachments.deleteMany({
        where: { teacher_id: id }
      })
      
      // Update teacher and recreate related records
      const teacher = await prisma.teachers.update({
        where: { id },
        data: {
          ...teacherData,
          posting_histories: {
            create: posting_histories || []
          },
          deputations: {
            create: deputations || []
          },
          attachments: {
            create: attachments || []
          }
        },
        include: {
          posting_histories: true,
          deputations: true,
          attachments: true
        }
      })
      
      return this.transformRelationsForFrontend(teacher)
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
      // Convert specific management values to match enum
      transformed.management = data.management === 'Adhoc Aided' ? 'Adhoc_Aided' : 
                             data.management === 'Council Aided' ? 'Council_Aided' :
                             data.management === 'Deficit Mission' ? 'Deficit_Mission' :
                             data.management === 'Local Body' ? 'Local_Body' :
                             data.management === 'Lumpsum Aided' ? 'Lumpsum_Aided' : data.management
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
      // Convert specific block office values to match enum
      transformed.block_office = data.block_office === 'DEO Aizawl' ? 'DEO_Aizawl' :
                                data.block_office === 'DEO Champhai' ? 'DEO_Champhai' :
                                data.block_office === 'DEO Hnahthial' ? 'DEO_Hnahthial' :
                                data.block_office === 'DEO Khawzawl' ? 'DEO_Khawzawl' :
                                data.block_office === 'DEO Kolasib' ? 'DEO_Kolasib' :
                                data.block_office === 'DEO Lawngtlai' ? 'DEO_Lawngtlai' :
                                data.block_office === 'DEO Lunglei' ? 'DEO_Lunglei' :
                                data.block_office === 'DEO Mamit' ? 'DEO_Mamit' :
                                data.block_office === 'DEO Saitual' ? 'DEO_Saitual' :
                                data.block_office === 'DEO Serchhip' ? 'DEO_Serchhip' :
                                data.block_office === 'DEO Siaha' ? 'DEO_Siaha' :
                                data.block_office === 'Education Office(CADC)' ? 'Education_Office_CADC_' :
                                data.block_office === 'Education Office (LADC)' ? 'Education_Office__LADC_' :
                                data.block_office === 'Education Office (MADC)' ? 'Education_Office__MADC_' :
                                data.block_office === 'SDEO Aizawl East' ? 'SDEO_Aizawl_East' :
                                data.block_office === 'SDEO Aizawl South' ? 'SDEO_Aizawl_South' :
                                data.block_office === 'SDEO Aizawl West' ? 'SDEO_Aizawl_West' :
                                data.block_office === 'SDEO Champhai' ? 'SDEO_Champhai' :
                                data.block_office === 'SDEO Darlawn' ? 'SDEO_Darlawn' :
                                data.block_office === 'SDEO Hnahthial' ? 'SDEO_Hnahthial' :
                                data.block_office === 'SDEO Kawnpui' ? 'SDEO_Kawnpui' :
                                data.block_office === 'SDEO Kawrthah' ? 'SDEO_Kawrthah' :
                                data.block_office === 'SDEO Khawzawl' ? 'SDEO_Khawzawl' :
                                data.block_office === 'SDEO Kolasib' ? 'SDEO_Kolasib' :
                                data.block_office === 'SDEO Lunglei North' ? 'SDEO_Lunglei_North' :
                                data.block_office === 'SDEO Lunglei South' ? 'SDEO_Lunglei_South' :
                                data.block_office === 'SDEO Lungsen' ? 'SDEO_Lungsen' :
                                data.block_office === 'SDEO Mamit' ? 'SDEO_Mamit' :
                                data.block_office === 'SDEO North Vanlaiphai' ? 'SDEO_North_Vanlaiphai' :
                                data.block_office === 'SDEO Saitual' ? 'SDEO_Saitual' :
                                data.block_office === 'SDEO Serchhip' ? 'SDEO_Serchhip' :
                                data.block_office === 'SDEO Thenzawl' ? 'SDEO_Thenzawl' :
                                data.block_office === 'SDEO West Phaileng' ? 'SDEO_West_Phaileng' : data.block_office
    }
    
    // Handle related data arrays
    if (data.posting_histories !== undefined) {
      transformed.posting_histories = data.posting_histories.map((posting: any) => ({
        school_name: posting.school_name,
        school_type: posting.school_type === 'Co-educational' ? 'Co_educational' : posting.school_type,
        medium: posting.medium,
        management: posting.management === 'Adhoc Aided' ? 'Adhoc_Aided' : 
                   posting.management === 'Council Aided' ? 'Council_Aided' :
                   posting.management === 'Deficit Mission' ? 'Deficit_Mission' :
                   posting.management === 'Local Body' ? 'Local_Body' :
                   posting.management === 'Lumpsum Aided' ? 'Lumpsum_Aided' : posting.management,
        block_office: posting.block_office === 'DEO Aizawl' ? 'DEO_Aizawl' :
                     posting.block_office === 'DEO Champhai' ? 'DEO_Champhai' :
                     posting.block_office === 'DEO Hnahthial' ? 'DEO_Hnahthial' :
                     posting.block_office === 'DEO Khawzawl' ? 'DEO_Khawzawl' :
                     posting.block_office === 'DEO Kolasib' ? 'DEO_Kolasib' :
                     posting.block_office === 'DEO Lawngtlai' ? 'DEO_Lawngtlai' :
                     posting.block_office === 'DEO Lunglei' ? 'DEO_Lunglei' :
                     posting.block_office === 'DEO Mamit' ? 'DEO_Mamit' :
                     posting.block_office === 'DEO Saitual' ? 'DEO_Saitual' :
                     posting.block_office === 'DEO Serchhip' ? 'DEO_Serchhip' :
                     posting.block_office === 'DEO Siaha' ? 'DEO_Siaha' :
                     posting.block_office === 'Education Office(CADC)' ? 'Education_Office_CADC_' :
                     posting.block_office === 'Education Office (LADC)' ? 'Education_Office__LADC_' :
                     posting.block_office === 'Education Office (MADC)' ? 'Education_Office__MADC_' :
                     posting.block_office === 'SDEO Aizawl East' ? 'SDEO_Aizawl_East' :
                     posting.block_office === 'SDEO Aizawl South' ? 'SDEO_Aizawl_South' :
                     posting.block_office === 'SDEO Aizawl West' ? 'SDEO_Aizawl_West' :
                     posting.block_office === 'SDEO Champhai' ? 'SDEO_Champhai' :
                     posting.block_office === 'SDEO Darlawn' ? 'SDEO_Darlawn' :
                     posting.block_office === 'SDEO Hnahthial' ? 'SDEO_Hnahthial' :
                     posting.block_office === 'SDEO Kawnpui' ? 'SDEO_Kawnpui' :
                     posting.block_office === 'SDEO Kawrthah' ? 'SDEO_Kawrthah' :
                     posting.block_office === 'SDEO Khawzawl' ? 'SDEO_Khawzawl' :
                     posting.block_office === 'SDEO Kolasib' ? 'SDEO_Kolasib' :
                     posting.block_office === 'SDEO Lunglei North' ? 'SDEO_Lunglei_North' :
                     posting.block_office === 'SDEO Lunglei South' ? 'SDEO_Lunglei_South' :
                     posting.block_office === 'SDEO Lungsen' ? 'SDEO_Lungsen' :
                     posting.block_office === 'SDEO Mamit' ? 'SDEO_Mamit' :
                     posting.block_office === 'SDEO North Vanlaiphai' ? 'SDEO_North_Vanlaiphai' :
                     posting.block_office === 'SDEO Saitual' ? 'SDEO_Saitual' :
                     posting.block_office === 'SDEO Serchhip' ? 'SDEO_Serchhip' :
                     posting.block_office === 'SDEO Thenzawl' ? 'SDEO_Thenzawl' :
                     posting.block_office === 'SDEO West Phaileng' ? 'SDEO_West_Phaileng' : posting.block_office,
        district: posting.district,
        rd_block: posting.rd_block,
        pincode: posting.pincode,
        habitation: posting.habitation,
        habitation_class: posting.habitation_class,
        habitation_category: posting.habitation_category,
        from_date: posting.from_date ? new Date(posting.from_date).toISOString() : undefined,
        to_date: posting.to_date ? new Date(posting.to_date).toISOString() : undefined,
        status: posting.status
      }))
    }
    
    if (data.deputations !== undefined) {
      transformed.deputations = data.deputations.map((deputation: any) => ({
        department_name: deputation.department_name,
        designation: deputation.designation,
        joining_date: deputation.joining_date ? new Date(deputation.joining_date).toISOString() : undefined,
        end_date: deputation.end_date ? new Date(deputation.end_date).toISOString() : undefined,
        status: deputation.status
      }))
    }
    
    if (data.attachments !== undefined) {
      transformed.attachments = data.attachments.map((attachment: any) => ({
        department_name: attachment.department_name,
        designation: attachment.designation,
        district: attachment.district,
        rd_block: attachment.rd_block,
        habitation: attachment.habitation,
        joining_date: attachment.joining_date ? new Date(attachment.joining_date).toISOString() : undefined,
        end_date: attachment.end_date ? new Date(attachment.end_date).toISOString() : undefined,
        status: attachment.status
      }))
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
