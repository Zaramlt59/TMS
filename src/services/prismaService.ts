import { PrismaClient } from '@prisma/client'

// Set DATABASE_URL if not available
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/ttms_db'
}

// Create a single PrismaClient instance that can be shared throughout your app
const prisma = new PrismaClient({
  log: [], // Option 1: No logs, regardless of environment variables
})

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
