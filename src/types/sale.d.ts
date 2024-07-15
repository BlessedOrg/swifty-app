import { ILotteryV1 } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2 } from "@/hooks/sales/useLotteryV2";
import { IAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { IAuctionV2 } from "@/hooks/sales/useAuctionV2";
import {UserSaleStats} from "@/server/userSaleStats";

export {};
declare global {
  interface ISaleData {
    lotteryV1: ILotteryV1;
    lotteryV2: ILotteryV2;
    auctionV1: IAuctionV1;
    auctionV2: IAuctionV2;
  }
  interface ICommonSaleData {
    userFunds: number | null;
    vacancyTicket: number | null;
    price: number;
    winners: string[] | null;
    isLotteryStarted?: boolean;
    isOwner?: boolean;
    missingFunds: number | null;
    hasMinted: boolean;
    isWinner: boolean;
    lotteryState?: "ACTIVE" | "ENDED" | "NOT_STARTED";
    readDataForAddress?: string;
    isDefaultState: boolean;
  }

  type ILotteryV1Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;
  };
  type ILotteryV2Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;
    rollPrice: number | null;
    rollTolerance: number | null;
    rolledNumbers: any[];
    isRolling?: boolean;
  };

  interface IAuvtionV1LastRound {
    index: number | null;
    finishAt: number | null;
    isFinished: boolean | null;
    numberOfTickets: number | null;
    lotteryStarted: boolean | null;
    winnersSelected: boolean | null;
  }

  type IAuctionV1Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    randomNumber: number;
    prevRoundTicketsAmount: number | null;
    prevRoundDeposits: number | null;
    roundCounter: number | null;
    lastRound: IAuvtionV1LastRound | null;
  };

  type IAuctionV2Data = ICommonSaleData & {
    users: string[] | null;
    lastWinner: number | null;
    myNumber: number | null;
    winningChance: number | null;
    position: number | null;
    contractAddress?: string;
    userDeposits: any;
    isParticipant: boolean;
    initialPrice: number | null;
    participantsStats: {
      amount: number;
      timestamp: number;
      isWinner: boolean;
      address: string;
    }[];
  };
  interface UserSaleStats {
    lotteryV1Participant?: boolean;
    lotteryV2Participant?: boolean;
    auctionV1Participant?: boolean;
    auctionV2Participant?: boolean;
    ticketSaleId: string;
    userId: string;
    lotteryV1depositedAmount?: number;
    lotteryV2depositedAmount?: number;
    auctionV1depositedAmount?: number;
    auctionV2depositedAmount?: number;
    lotteryV2RollQuantity?: number;
    saleId?: "lotteryV1" | "lotteryV2" | "auctionV1" | "auctionV2";
  }
   interface ISaleStats {
    totalTicketsSold: number;
    totalTicketsSoldPercentage: number;
    totalRevenue: number;
    totalDepositsAmount: number;
    totalTicketsCap: number;
    sellProgressPerPhase: {
      lv1: number;
      lv2: number;
      av1: number;
      av2: number;
    };
    depositsPerPhase: {
      lv1: number;
      lv2: number;
      av1: number;
      av2: number;
    };
    ticketsSoldPerPhase: {
      lv1: number;
      lv2: number;
      av1: number;
      av2: number;
    };
    revenuePerPhase: {
      lv1: number;
      lv2: number;
      av1: number;
      av2: number;
    };
    winnersPerPhase: {
      lv1: UserSaleStats[];
      lv2: UserSaleStats[];
      av1: UserSaleStats[];
      av2: UserSaleStats[];
    };
    participantsPerPhase: {
      lv1: number;
      lv2: number;
      av1: number;
      av2: number;
    };
    allParticipants: number;
    statsPerPhase: {
      lv1: {
        soldOut: boolean;
        averagePricePerTicket: number;
      };
      lv2: {
        soldOut: boolean;
        totalRolls: number;
        averageRollsToWin: number;
        averagePricePerTicket: number;
      };
      av1: {
        soldOut: boolean;
        averagePricePerTicket: number;
      };
      av2: {
        soldOut: boolean;
        averagePricePerTicket: number;
      };
    };
  }
}
