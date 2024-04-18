import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const { ticketSale, user, eventLocation, speaker } = prisma;

export { prisma, ticketSale, user, speaker, eventLocation };
