import { PrismaClient, LogType } from "@prisma/client";

const prisma = new PrismaClient();

const {
  ticketSale,
  user,
  eventLocation,
  speaker,
  address,
  log,
  ticketMint,
  userToken,
} = prisma;

export {
  prisma,
  ticketSale,
  user,
  speaker,
  eventLocation,
  address,
  log,
  LogType,
  ticketMint,
  userToken,
};
