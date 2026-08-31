import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const settings = await prisma.setting.findMany();
  console.log("Settings:", settings);
  
  const priests = await prisma.priest.findMany();
  console.log("Priests count:", priests.length);
  if (priests.length > 0) console.log(priests[0]);
  
  const services = await prisma.service.findMany();
  console.log("Services count:", services.length);
  if (services.length > 0) console.log(services[0]);
}

check().catch(console.error).finally(() => prisma.$disconnect());
