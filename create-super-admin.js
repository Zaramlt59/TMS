const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

async function createSuperAdmin() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔐 Creating Super Admin user...')
    
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.users.findFirst({
      where: { role: 'super_admin' }
    })
    
    if (existingSuperAdmin) {
      console.log('✅ Super Admin already exists!')
      console.log('📧 Username:', existingSuperAdmin.username)
      console.log('🎯 Role:', existingSuperAdmin.role)
      return
    }
    
    // Create super admin user
    const hashedPassword = await bcrypt.hash('superadmin123', 10)
    
    const superAdmin = await prisma.users.create({
      data: {
        username: 'superadmin',
        email: 'superadmin@tms.gov.in',
        password: hashedPassword,
        role: 'super_admin',
        is_active: true
      }
    })
    
    console.log('✅ Super Admin created successfully!')
    console.log('📧 Username: superadmin')
    console.log('🔑 Password: superadmin123')
    console.log('🎯 Role: super_admin')
    console.log('⚠️  Please change the password after first login!')
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createSuperAdmin()
