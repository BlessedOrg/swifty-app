import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const { 
  ticketSale, 
  user 
} = prisma;

export {
  prisma,
  ticketSale, 
  user
}