import { PrismaClient, LogType } from "@prisma/client";

const prisma = new PrismaClient();

const {
  ticketSale,
  user,
  eventLocation,
  speaker,
  log
} = prisma;

export {
  prisma,
  ticketSale,
  user,
  speaker,
  eventLocation,
  log,
  LogType
};
