import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config({ path: require('path').resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function main() {
  try {
    const result = await prisma.$queryRawUnsafe('SELECT 1 AS ok')
    console.log('Prisma OK:', result)
  } catch (e: any) {
    console.error('Prisma ERROR:', e.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(1))


