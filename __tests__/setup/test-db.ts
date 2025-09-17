import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

// Test database configuration
const testDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tms_test',
  port: parseInt(process.env.DB_PORT || '3306'),
}

// Create test Prisma client
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: `mysql://${testDbConfig.user}:${testDbConfig.password}@${testDbConfig.host}:${testDbConfig.port}/${testDbConfig.database}`
    }
  }
})

// Test data setup
export async function setupTestData() {
  try {
    // Clear existing test data
    await cleanupTestData()

    // Create test districts
    const testDistrict = await testPrisma.districts.create({
      data: {
        name: 'Test District',
        is_active: true
      }
    })

    // Create test RD blocks
    const testRdBlock = await testPrisma.rd_blocks.create({
      data: {
        district_id: testDistrict.id,
        name: 'Test RD Block',
        is_active: true
      }
    })

    // Create test villages
    const testVillage = await testPrisma.villages.create({
      data: {
        rd_block_id: testRdBlock.id,
        name: 'Test Village',
        is_active: true
      }
    })

    // Create test management types
    const testManagementType = await testPrisma.management_types.create({
      data: {
        name: 'Government',
        is_active: true
      }
    })

    // Create test school types
    const testSchoolType = await testPrisma.school_types.create({
      data: {
        name: 'High School',
        is_active: true
      }
    })

    // Create test mediums
    const testMedium = await testPrisma.mediums.create({
      data: {
        name: 'English',
        is_active: true
      }
    })

    // Create test subjects
    const testSubject = await testPrisma.subjects.create({
      data: {
        name: 'Mathematics',
        code: 'MATH',
        classes: '1,2,3,4,5'
      }
    })

    // Create test religions
    const testReligion = await testPrisma.religions.create({
      data: {
        name: 'Hindu',
        is_active: true
      }
    })

    // Create test service categories
    const testServiceCategory = await testPrisma.service_categories.create({
      data: {
        name: 'Teaching',
        is_active: true
      }
    })

    // Create test block office
    const testBlockOffice = await testPrisma.block_offices.create({
      data: {
        name: 'Test Block Office',
        is_active: true
      }
    })

    // Create test school
    const testSchool = await testPrisma.schools.upsert({
      where: { school_id: 'TEST001' },
      update: {},
      create: {
        school_id: 'TEST001',
        school_name: 'Test School',
        school_type: 'Co_educational',
        school_level: 'Primary, Secondary',
        management: 'Government',
        medium: 'English',
        pincode: '123456',
        district: 'Test District',
        rd_block: 'Test RD Block',
        school_phone: '9876543210',
        school_email: 'test@school.com',
        habitation: 'Test Village',
        habitation_class: 'Rural',
        habitation_category: 'Village',
        block_office: 'DEO_Aizawl'
      }
    })

    // Create test users
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const testAdmin = await testPrisma.users.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@test.com',
        phone: '9876543210',
        password: hashedPassword,
        role: 'admin',
        is_active: true
      }
    })

    const testTeacher = await testPrisma.users.upsert({
      where: { username: 'teacher' },
      update: {},
      create: {
        username: 'teacher',
        email: 'teacher@test.com',
        phone: '9876543211',
        password: hashedPassword,
        role: 'teacher',
        is_active: true,
        school_id: 'TEST001'
      }
    })

    // Create test teacher record
    const testTeacherRecord = await testPrisma.teachers.create({
      data: {
        teacher_name: 'Test Teacher',
        date_of_birth: new Date('1990-01-01'),
        joining_date: new Date('2020-01-01'),
        phone_number: '9876543211',
        email: 'teacher@test.com',
        social_group: 'General',
        religion: 'Hindu',
        gender: 'Male',
        aadhaar_number: '123456789012',
        area_village: 'Test Village',
        subjects_taught: 'Mathematics, Science',
        classes_taught: '1,2,3,4,5',
        school_id: 'TEST001',
        current_school_name: 'Test School',
        school_level: 'Primary, Secondary',
        management: 'Government',
        medium: 'English',
        service_category: 'Teaching',
        habitation: 'Test Village',
        pincode: '123456',
        district: 'Test District',
        rd_block: 'Test RD Block',
        school_phone: '9876543210',
        habitation_class: 'Rural',
        habitation_category: 'Village',
        block_office: 'DEO_Aizawl'
      }
    })

    // Create test medical record
    const testMedicalRecord = await testPrisma.medical_records.create({
      data: {
        teacher_id: testTeacherRecord.id,
        ailment_name: 'Test Ailment',
        severity: 'Moderate',
        diagnosis_date: new Date('2024-01-15'),
        treatment_status: 'Ongoing',
        remarks: 'Test medical record',
        entered_by_id: testAdmin.id
      }
    })

    console.log('✅ Test data setup completed successfully')
    
    return {
      testDistrict,
      testRdBlock,
      testVillage,
      testManagementType,
      testSchoolType,
      testMedium,
      testSubject,
      testReligion,
      testServiceCategory,
      testBlockOffice,
      testSchool,
      testAdmin,
      testTeacher,
      testTeacherRecord,
      testMedicalRecord
    }
  } catch (error) {
    console.error('❌ Test data setup failed:', error)
    throw error
  }
}

// Cleanup test data
export async function cleanupTestData() {
  try {
    // Delete in reverse order to handle foreign key constraints
    await testPrisma.medical_record_logs.deleteMany().catch(() => {})
    await testPrisma.medical_records.deleteMany().catch(() => {})
    await testPrisma.audit_logs.deleteMany().catch(() => {})
    await testPrisma.refresh_tokens.deleteMany().catch(() => {})
    await testPrisma.otp_verification.deleteMany().catch(() => {})
    await testPrisma.teachers.deleteMany().catch(() => {})
    await testPrisma.users.deleteMany().catch(() => {})
    await testPrisma.schools.deleteMany().catch(() => {})
    await testPrisma.villages.deleteMany().catch(() => {})
    await testPrisma.rd_blocks.deleteMany().catch(() => {})
    await testPrisma.districts.deleteMany().catch(() => {})
    await testPrisma.management_types.deleteMany().catch(() => {})
    await testPrisma.school_types.deleteMany().catch(() => {})
    await testPrisma.mediums.deleteMany().catch(() => {})
    await testPrisma.subjects.deleteMany().catch(() => {})
    await testPrisma.religions.deleteMany().catch(() => {})
    await testPrisma.service_categories.deleteMany().catch(() => {})
    await testPrisma.block_offices.deleteMany().catch(() => {})
    
    console.log('✅ Test data cleanup completed')
  } catch (error) {
    console.error('❌ Test data cleanup failed:', error)
    throw error
  }
}

// Close test database connection
export async function closeTestDb() {
  await testPrisma.$disconnect()
}
