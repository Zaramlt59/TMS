import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- Districts ---')
  const districts = await prisma.districts.findMany()
  console.log(JSON.stringify(districts, null, 2))

  console.log('--- RD Blocks for Lawngtlai ---')
  const lawngtlaiDist = districts.find(d => d.name.toLowerCase().includes('lawngtlai'))
  if (lawngtlaiDist) {
    const rdBlocks = await prisma.rd_blocks.findMany({
      where: { district_id: lawngtlaiDist.id }
    })
    console.log(JSON.stringify(rdBlocks, null, 2))
  } else {
    console.log('Lawngtlai district not found')
  }

  console.log('--- Block Offices ---')
  const blockOffices = await prisma.block_offices.findMany()
  console.log(JSON.stringify(blockOffices, null, 2))
  
  await prisma.$disconnect()
}

main()
