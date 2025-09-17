

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
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })


