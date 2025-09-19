

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.users.findFirst({ where: { role: 'admin' } })
  if (!admin) {
    const password = await bcrypt.hash('admin123', 12)
    await prisma.users.create({
      data: {
        username: 'admin',
        email: 'admin@tms.com',
        password,
        role: 'admin',
        is_active: true,
      }
    })
    console.log('Seed: default admin created (admin/admin123) - change ASAP')
  } else {
    console.log('Seed: admin already exists, skipping')
  }

  // Create test teacher for regular login (no phone needed)
  const teacher = await prisma.users.findFirst({ where: { role: 'teacher' } })
  if (!teacher) {
    const password = await bcrypt.hash('teacher123', 12)
    await prisma.users.create({
      data: {
        username: 'teacher',
        email: 'teacher@tms.com',
        password,
        role: 'teacher',
        is_active: true,
      }
    })
    console.log('Seed: test teacher created (teacher/teacher123)')
  } else {
    console.log('Seed: teacher already exists, skipping')
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })


