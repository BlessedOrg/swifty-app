import { NextResponse } from "next/server";
import { ticketSale, userSale, prisma } from "@/prisma/models";
import { revalidatePath } from "next/cache";
import { readSmartContract } from "@/utils/contracts/contracts";
import { contractsInterfaces } from "../../../../../services/viem";
import { headers } from "next/headers";
import { usdcContractDecimals } from "../../../../../services/web3Config";

export const dynamic = "force-dynamic";

interface PhaseStats {
  tickets: number;
  users: string[];
  winners: string[];
}

type AllSaleStats = {
  [key in "lv1" | "lv2" | "av1" | "av2"]: PhaseStats;
};

export async function GET(req: Request, { params }) {
  const { id } = params;
  const headersList = headers();
  const walletAddress = headersList.get("x-wallet-address");

  if (!id) {
    return NextResponse.json(
      {
        error: "Provide correct ID",
      },
      { status: 400 },
    );
  }

  const sale = await ticketSale.findUnique({
    where: { id },
    select: {
      lotteryV1settings: true,
      lotteryV2settings: true,
      auctionV1settings: true,
      auctionV2settings: true,
      lotteryV1contractAddr: true,
      lotteryV2contractAddr: true,
      auctionV1contractAddr: true,
      auctionV2contractAddr: true,
      priceCents: true,
      seller: true
    },
  });
  if (!sale) {
    return NextResponse.json(
      {
        error: "Not found",
      },
      { status: 400 },
    );
  }
  if(sale.seller.walletAddr !== walletAddress){
    return NextResponse.json(
        {
          error: "Not authorized to view this sale stats",
        },
        { status: 401 },
    );
  }
  const {
    lotteryV1contractAddr,
    lotteryV2contractAddr,
    auctionV1contractAddr,
    auctionV2contractAddr,
    lotteryV1settings,
    lotteryV2settings,
    auctionV1settings,
    auctionV2settings,
    priceCents,
  } = sale;
  const getSaleParticipantsAndTheirStats = async () => {
    return userSale.findMany({
      where: {
        ticketSaleId: id,
      },
      include: {
        user: {
          select: {
            walletAddr: true
          }
        }
      }
    });
  };

  const usersStats = await getSaleParticipantsAndTheirStats();
  const lotteryV1 = lotteryV1settings as {
    ticketsAmount: number;
    enabled: boolean;
  };
  const lotteryV2 = lotteryV2settings as {
    ticketsAmount: number;
    rollPrice: number;
    enabled: boolean;
  };
  const auctionV1 = auctionV1settings as {
    ticketsAmount: number;
    priceIncrease: number;
    enabled: boolean;
  };
  const auctionV2 = auctionV2settings as {
    ticketsAmount: number;
    enabled: boolean;
  };
  const methods = [
    { key: "tickets", value: "numberOfTickets", type: "number" },
    { key: "users", value: "getParticipants" },
    { key: "winners", value: "getWinners" },
  ];
  const phasesAddressesAndAbi = {
    lv1: {
      address: lotteryV1contractAddr,
      abi: contractsInterfaces.LotteryV1.abi,
    },
    lv2: {
      address: lotteryV2contractAddr,
      abi: contractsInterfaces.LotteryV2.abi,
    },
    av1: {
      address: auctionV1contractAddr,
      abi: contractsInterfaces.AuctionV1.abi,
    },
    av2: {
      address: auctionV2contractAddr,
      abi: contractsInterfaces.AuctionV2.abi,
    },
  };

  const readCurrentSaleStats = async () => {
    const results: Record<string, Record<string, any>> = {};

    for (const [phaseKey, phaseData] of Object.entries(phasesAddressesAndAbi)) {
      results[phaseKey] = {};
      const passSigner = phaseKey === "av11";
      for (const method of methods) {
        const args = passSigner ? [walletAddress] : [];
        try {
          const result = await readSmartContract(
            phaseData.address,
            phaseData.abi,
            method.value,
            args,
          );
          if (phaseKey === "av1") {
            results[phaseKey][method.key] =
              method.type === "number"
                ? Number(result) / 10 ** usdcContractDecimals
                : result;
          } else {
            results[phaseKey][method.key] =
              method.type === "number" ? Number(result) : result;
          }
        } catch (error) {
          console.error(
            `Error reading ${method.value} for ${phaseKey}:`,
            error,
          );
          results[phaseKey][method.key] = null;
        }
      }
    }

    return results;
  };

  const saleContractData = (await readCurrentSaleStats()) as AllSaleStats;

  const ticketsSoldPerPhase = {
    lv1: saleContractData.lv1.winners.length,
    lv2: saleContractData.lv2.winners.length,
    av1: saleContractData.av1.winners.length,
    av2: saleContractData.av2.winners.length,
  };

  const totalTicketsSold = Object.values(ticketsSoldPerPhase).reduce(
    (sum, current) => sum + current,
    0,
  );
  const totalTicketsSoldPercentage =
    ((totalTicketsSold /
      (lotteryV1.ticketsAmount +
        lotteryV2.ticketsAmount +
        auctionV1.ticketsAmount +
        auctionV2.ticketsAmount)) *
    100).toFixed(2);

  const sellProgressPerPhase = {
    lv1: +((ticketsSoldPerPhase['lv1'] / lotteryV1.ticketsAmount) * 100).toFixed(2),
    lv2: +((ticketsSoldPerPhase['lv2'] / lotteryV2.ticketsAmount) * 100).toFixed(2),
    av1: +((ticketsSoldPerPhase['av1'] / auctionV1.ticketsAmount) * 100).toFixed(2),
    av2: +((ticketsSoldPerPhase['av2'] / auctionV2.ticketsAmount) * 100).toFixed(2),
  }

  const totalRolls = usersStats.reduce(
    (sum, current) => sum + (current.lotteryV2RollQuantity || 0),
    0,
  );
  const usersWhoWinInLv1 = usersStats.filter(i => saleContractData.lv1.winners.includes(i.user.walletAddr))
  const usersWhoWinInLv2 = usersStats.filter(i => saleContractData.lv2.winners.includes(i.user.walletAddr))
  const usersWhoWinInAv1 = usersStats.filter(i => saleContractData.av1.winners.includes(i.user.walletAddr))
  const usersWhoWinInAv2 = usersStats.filter(i => saleContractData.av2.winners.includes(i.user.walletAddr))

  const taxPercentage = 5

  const lv1Revenue = usersWhoWinInLv1.length * ((priceCents || 0)/100)
  const lv2Revenue = totalRolls - (totalRolls * taxPercentage/100);
  const av1Revenue = usersWhoWinInAv1.reduce(
      (sum, current) => sum + (current.auctionV1depositedAmount || 0),
      0,
  )
  const av2Revenue = usersWhoWinInAv2.reduce(
      (sum, current) => sum + (current.auctionV2depositedAmount || 0),
      0,
  );

  const depositsPerPhase = {
    lv1: usersStats.reduce((total, userSale) => {
    return total + (userSale.lotteryV1depositedAmount || 0)
  }, 0),
    lv2 : usersStats.reduce((total, userSale) => {
      return total + (userSale.lotteryV2depositedAmount || 0)
    }, 0),
    av1 : usersStats.reduce((total, userSale) => {
      return total + (userSale.auctionV1depositedAmount || 0)
    }, 0),
    av2 : usersStats.reduce((total, userSale) => {
      return total + (userSale.auctionV2depositedAmount || 0)
    }, 0),
}
  const totalRevenue = (lv1Revenue + lv2Revenue + av1Revenue + av2Revenue);

  const sumTotalDeposits = () => {
    return usersStats.reduce((total, userSale) => {
      return total +
          (userSale.lotteryV1depositedAmount || 0) +
          (userSale.lotteryV2depositedAmount || 0) +
          (userSale.auctionV1depositedAmount || 0) +
          (userSale.auctionV2depositedAmount || 0);
    }, 0).toFixed(2);
  };
  const totalTicketsCap = (lotteryV1.ticketsAmount +
      lotteryV2.ticketsAmount +
      auctionV1.ticketsAmount +
      auctionV2.ticketsAmount)
  const totalDepositsAmount = sumTotalDeposits();

  const saleStats = {
    totalTicketsSold,
    totalTicketsSoldPercentage,
    totalTicketsCap,
    totalRevenue: (totalRevenue - (totalRevenue * taxPercentage/100)).toFixed(2),
    ticketsSoldPerPhase,
    totalDepositsAmount,
    revenuePerPhase: {
      lv1: lv1Revenue - (lv1Revenue * taxPercentage/100),
      lv2: lv2Revenue,
      av1: av1Revenue - (av1Revenue * taxPercentage/100),
      av2: av2Revenue - (av2Revenue * taxPercentage/100),
    },
    depositsPerPhase,
    sellProgressPerPhase,
    winnersPerPhase: {
        lv1: usersWhoWinInLv1,
        lv2: usersWhoWinInLv2,
        av1: usersWhoWinInAv1,
        av2: usersWhoWinInAv2,
    },
    participantsPerPhase: {
      lv1: usersStats.filter((i) => i.lotteryV1Participant).length,
      lv2: usersStats.filter((i) => i.lotteryV2Participant).length,
      av1: usersStats.filter((i) => i.auctionV1Participant).length,
      av2: usersStats.filter((i) => i.auctionV2Participant).length,
    },
    allParticipants: usersStats.length,
    statsPerPhase: {
      lv1: {
        soldOut:
          lotteryV1.ticketsAmount <= saleContractData.lv1.winners.length,
        averagePricePerTicket: (priceCents || 0) / 100,
      },
      lv2: {
        soldOut:
          lotteryV2.ticketsAmount <= saleContractData.lv2.winners.length,
        totalRolls,
        averageRollsToWin: totalRolls / usersWhoWinInLv2.length,
        averagePricePerTicket: lv2Revenue / usersWhoWinInLv2.length,
      },
      av1: {
        soldOut:
          auctionV1.ticketsAmount <= saleContractData.av1.winners.length,
        averagePricePerTicket: av1Revenue / usersWhoWinInAv1.length,
      },
      av2: {
        soldOut:
          auctionV2.ticketsAmount <= saleContractData.av2.winners.length,
        averagePricePerTicket:  av2Revenue / usersWhoWinInAv2.length,
      },
    },
  };

  revalidatePath(req.url);

  return NextResponse.json(
    { error: null, saleStats, usersStats },
    { status: 200 },
  );
}
